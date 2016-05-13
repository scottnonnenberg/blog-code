
'use strict';

var async = require('async');
var _ = require('lodash');

var lib = require('./lib_callbacks');


var saveUserNewPostReferences = function(id, cb) {
  async.auto({
    // getUser and getPosts are run in parallel
    getUser: function(cb) {
      lib.db.getUser(id, cb);
    },
    getPosts: function(cb) {
      lib.db.getPosts(id, cb);
    },
    getAllNewReferences: ['getPosts', function(cb, result) {
      var posts = result.getPosts;
      var check = lib.twitter.checkForNewReferences.bind(lib.twitter);

      async.map(posts, check, cb);
    }],
    saveReferences: ['getAllNewReferences', function(cb, result) {
      var references = result.getAllNewReferences;
      var save = lib.db.saveReference.bind(lib.db);

      async.map(_.flatten(references), save, cb);
    }],

    // we don't actually need the user until this point
    emailUserIf: ['saveReferences', 'getUser', function(cb, result) {
      var references = result.saveReferences;
      var user = result.getUser;

      if (references.length > 0) {
        return lib.email.send(user.email, 'You have new mentions!', function(err) {
          cb(err, true);
        });
      }

      return cb(null, false);
    }]
  }, cb);
};

saveUserNewPostReferences(3, function(err, result) {
  if (err) {
    return console.log(err.stack);
  }

  console.log('newReferences:', result.emailUserIf);
});
