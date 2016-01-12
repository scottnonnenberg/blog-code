
'use strict';

var async = require('async');
var _ = require('lodash');

var lib = require('./lib_callbacks');


function NewReferencesProcess(options) {
  if (!(this instanceof NewReferencesProcess)) {
    return new NewReferencesProcess(options);
  }

  options = options || {};
  this._userId = options.userId;

  if (!this._userId) {
    throw new Error('Need userId property on options!');
  }

  // capturing these dependencies locally allows for dependency injection during testing
  this.db = options.db || lib.db;
  this.twitter = options.twitter || lib.twitter;
  this.email = options.email || lib.email;

  _.bindAll(this);
}

module.exports = NewReferencesProcess;


NewReferencesProcess.prototype.go = function go(cb) {
  var steps = [
    this.getUser,
    this.getPosts,
    this.getAllNewReferences,
    this.saveReferences,
    this.emailUserIf
  ];

  async.series(steps, function(err, results) {
    if (err) {
      return cb(err);
    }

    return cb(err, _.last(results));
  });
};

NewReferencesProcess.prototype.getUser = function getUser(cb) {
  var _this = this;

  this.db.getUser(this._userId, function(err, user) {
    if (err) {
      return cb(err);
    }

    if (!user) {
      return cb(new Error('Could not find user! ' + _this._userId));
    }

    _this._user = user;

    return cb(null, user);
  });
};

NewReferencesProcess.prototype.getPosts = function getPosts(cb) {
  var _this = this;

  this.db.getPosts(this._userId, function(err, posts) {
    if (err) {
      return cb(err);
    }

    _this._posts = posts;

    return cb(null, posts);
  });
};

NewReferencesProcess.prototype.getAllNewReferences = function getAllNewReferences(cb) {
  var _this = this;
  var check = this.twitter.checkForNewReferences.bind(this.twitter);

  async.map(this._posts, check, function(err, references) {
    if (err) {
      return cb(err);
    }

    _this._references = _.flatten(references);

    return cb(null, _this._references);
  });
};

NewReferencesProcess.prototype.saveReferences = function saveReferences(cb) {
  var save = this.db.saveReference.bind(this.db);

  async.map(this._references, save, cb);
};

NewReferencesProcess.prototype.emailUserIf = function emailUserIf(cb) {
  if (this._references.length) {
    return this.email.send(this._user.email, 'You have new mentions!', function(err) {
      if (err) {
        return cb(err);
      }

      return cb(null, true); // true for new references
    });
  }

  return cb();
};

var refProcess = new NewReferencesProcess({userId: 3});

refProcess.go(function(err, newReferences) {
  if (err) {
    return console.log(err.stack);
  }

  console.log('newReferences:', newReferences);
});
