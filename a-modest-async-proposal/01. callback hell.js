
'use strict';

var async = require('async');
var _ = require('lodash');

var lib = require('./lib_callbacks');


var saveUserNewPostReferences = function(id, cb) {
  lib.db.getUser(id, function(err, user) {
    if (err) {
      return cb(err);
    }

    if (!user) {
      return cb(new Error('Could not find user! ' + id));
    }

    lib.db.getPosts(user.id, function(err, posts) {
      if (err) {
        return cb(err);
      }

      var check = lib.twitter.checkForNewReferences.bind(lib.twitter);

      async.map(posts, check, function(err, references) {
        if (err) {
          return cb(err);
        }

        references = _.flatten(references);

        async.map(references, lib.db.saveReference.bind(lib.db), function(err) {
          if (err) {
            return cb(err);
          }

          if (references.length) {
            return lib.email.send(user.email, 'You have new mentions!', function(err) {
              if (err) {
                return cb(err);
              }

              return cb(null, true); // true for new references
            });
          }

          return cb();
        });
      });
    });
  });
};

saveUserNewPostReferences(3, function(err, newReferences) {
  if (err) {
    return console.log(err.stack);
  }

  console.log('newReferences:', newReferences);
});
