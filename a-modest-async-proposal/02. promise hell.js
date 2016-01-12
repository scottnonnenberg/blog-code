
'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');

var lib = require('./lib_promises');


Bluebird.longStackTraces();

var saveUserNewPostReferences = function(id) {
  var user, references;

  return lib.db.getUser(id)
    .then(function(result) {
      user = result;

      if (!user) {
        return Bluebird.reject(new Error('Could not find user! ' + id));
      }

      return lib.db.getPosts(user.id);
    })
    .then(function(posts) {
      var checks = _.map(posts, function(post) {
        return lib.twitter.checkForNewReferences(post);
      });

      return Bluebird.all(checks);
    })
    .then(function(result) {
      references = result;

      var saves = _(references)
        .flatten()
        .map(function(reference) {
          return lib.db.saveReference(reference);
        })
        .value();

      return Bluebird.all(saves);
    })
    .then(function() {
      if (references.length) {
        return lib.email.send(user.email, 'You have new mentions!')
          .then(function() {
            return true;
          });
      }
    });
};

saveUserNewPostReferences(3)
  .then(function(newReferences) {
    console.log('newReferences:', newReferences);
  })
  .catch(function(err) {
    console.error(err.stack);
  });

