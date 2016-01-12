
'use strict';

var async = require('async');
var _ = require('lodash');

var lib = require('./lib_callbacks');


var saveUserNewPostReferences = function(id, cb) {
  var user, references;

  async.waterfall([
    function injectId(cb) {
      return cb(null, id);
    },
    lib.db.getUser.bind(lib.db),
    function checkUser(result, cb) {
      user = result;

      if (!user) {
        return cb(new Error('Could not find user! ' + id));
      }

      return cb(null, user);
    },
    lib.db.getPosts.bind(lib.db),
    function getAllNewReferences(posts, cb) {
      var check = lib.twitter.checkForNewReferences.bind(lib.twitter) ;
      async.map(posts, check, cb);
    },
    function saveReferences(result, cb) {
      references = _.flatten(result);
      async.map(references, lib.db.saveReference.bind(lib.db), cb);
    },
    function injectUserAndNew(result, cb) {
      return cb(null, user, Boolean(references.length));
    },
    function emailUserIf(user, newReferences, cb) {
      if (newReferences) {
        return lib.email.send(user.email, 'You have new mentions!', function(err) {
          if (err) {
            return cb(err);
          }

          return cb(null, true); // true for new references
        });
      }

      return cb();
    }
  ], cb);
};

saveUserNewPostReferences(3, function(err, newReferences) {
  if (err) {
    return console.log(err.stack);
  }

  console.log('newReferences:', newReferences);
});
