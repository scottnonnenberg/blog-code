
'use strict';

var Bluebird = require('bluebird');


module.exports.db = {
  getUser: function getUser(id) {
    return new Bluebird(function(resolve) {
      setTimeout(function() {
        console.log('db.getUser');
        resolve({
          name: 'user',
          email: 'user@somewhere.com',
          id: id
        });
      }, 0);
    });
  },

  getPosts: function getPosts(userId) {
    return new Bluebird(function(resolve) {
      setTimeout(function() {
        console.log('db.getPosts');
        resolve([{
          id: 2,
          title: 'cats',
          url: 'https://somewhere.com/blog/cats',
          userId: userId
        }, {
          id: 7,
          title: 'mice deserve to be hunted',
          url: 'https://somewhere.com/blog/mice-hunted',
          userId: userId
        }]);
      }, 0);
    });
  },

  saveReference: function saveReference() {
    return new Bluebird(function(resolve) {
      setTimeout(function() {
        console.log('db.saveReference');
        resolve(null);
      }, 0);
    });
  }
};

module.exports.TWITTER_CONCURRENT_LIMIT = 5;
module.exports.twitter = {
  checkForNewReferences: function checkForNewReferences() {
    return new Bluebird(function(resolve) {
      setTimeout(function() {
        console.log('twitter.checkForNewReferences');
        resolve([{
          user: 'someone',
          id: '2342343'
        }, {
          user: '__awesome__',
          id: '453454'
        }]);
      }, 0);
    });
  }
};

module.exports.email = {
  send: function send() {
    return new Bluebird(function(resolve) {
      setTimeout(function() {
        console.log('email.send');
        resolve();
      }, 0);
    });
  }
};
