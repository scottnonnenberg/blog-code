
'use strict';

var async = require('async');
var _ = require('lodash');
var assert = require('assert');

var lib = require('./lib_callbacks');


var saveUserNewPostReferences = function(id, cb) {
  async.auto({
    getUser: function(cb) {
      lib.db.getUser(id, cb);
    },
    getPosts: ['getUser', function(cb) {
      lib.db.getPosts(id, cb);
    }],
    getAllNewReferences: ['getPosts', function(cb, result) {
      var posts = result.getPosts,
          check = lib.twitter.checkForNewReferences.bind(lib.twitter) ;
      async.map(posts, check, cb);
    }],
    saveReferences: ['getAllNewReferences', function(cb, result) {
      var references = _.flatten(result.getAllNewReferences);
      async.map(references, lib.db.saveReference.bind(lib.db), cb);
    }],
    emailUserIf: ['saveReferences', function(cb, result) {
      var references = result.saveReferences,
          user = result.getUser;
          if (references.length > 0) {
            lib.email.send(user.email, 'You have new mentions!', function(err) {
              cb(err, true);
            });
          } else {
            return cb(null, false);
          }
    }]
  }, cb);
};

async.series([
  function testSuccess(cb) {
    saveUserNewPostReferences(3, function(err, result) {
      if (err) {
        return console.log(err.stack);
      }
      console.log('newReferences:', result.emailUserIf);
      cb();
    });
  },
  // function testFailure(callback) {
  //   saveUserNewPostReferences(25, function(err, result) {
  //     assert(err);
  //     assert(!result.emailUserIf);
  //     cb();
  //   });
  // }
]);
