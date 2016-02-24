
'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');

var lib = require('./lib_promises');


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


NewReferencesProcess.prototype.go = function go() {
  var steps = [
    this.getUser,
    this.getPosts,
    this.getAllNewReferences,
    this.saveReferences,
    this.emailUserIf
  ];
  var reduceStep = function reduceStep(index, step) {
    return step();
  };

  return Bluebird.reduce(steps, reduceStep, null);
};

NewReferencesProcess.prototype.getUser = function getUser() {
  var _this = this;

  return this.db.getUser(this._userId)
    .then(function(user) {
      if (!user) {
        return Bluebird.reject(new Error('Could not find user! ' + _this._userId));
      }

      _this._user = user;

      return user;
    });
};

NewReferencesProcess.prototype.getPosts = function getPosts() {
  var _this = this;

  return this.db.getPosts(this._userId)
    .then(function(posts) {
      _this._posts = posts;

      return posts;
    });
};

NewReferencesProcess.prototype.getAllNewReferences = function getAllNewReferences() {
  var _this = this;

  var checks = _.map(this._posts, function(post) {
    return _this.twitter.checkForNewReferences(post);
  });

  return Bluebird.all(checks)
    .then(function(references) {
      _this._references = _.flatten(references);

      return _this._references;
    });
};

NewReferencesProcess.prototype.saveReferences = function saveReferences() {
  var _this = this;

  var saves = _.map(this._references, function(reference) {
    return _this.db.saveReference(reference);
  });

  return Bluebird.all(saves);
};

NewReferencesProcess.prototype.emailUserIf = function emailUserIf() {
  if (this._references.length) {
    return this.email.send(this._user.email, 'You have new mentions!')
      .then(function()  {
        return true;
      });
  }

  return Bluebird.resolve();
};


var refProcess = new NewReferencesProcess({userId: 3});

refProcess.go()
  .then(function(newReferences) {
    console.log('newReferences:', newReferences);
  })
  .catch(function(err) {
    return console.log(err.stack);
  });
