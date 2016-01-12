
'use strict';

module.exports.db = {
  getUser: function getUser(id, cb) {
    setTimeout(function() {
      console.log('db.getUser');
      cb(null, {
        name: 'user',
        email: 'user@somewhere.com',
        id: id
      });
    }, 0);
  },

  getPosts: function getPosts(userId, cb) {
    setTimeout(function() {
      console.log('db.getPosts');
      cb(null, [{
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
  },

  saveReference: function saveReference(reference, cb) {
    setTimeout(function() {
      console.log('db.saveReference');
      cb(null);
    });
  }
};


module.exports.twitter = {
  checkForNewReferences: function checkForNewReferences(post, cb) {
    setTimeout(function() {
      console.log('twitter.checkForNewReferences');
      cb(null, [{
        user: 'someone',
        id: '2342343'
      }, {
        user: '__awesome__',
        id: '453454'
      }]);
    }, 0);
  }
};

module.exports.email = {
  send: function send(address, title, cb) {
    setTimeout(function() {
      console.log('email.send');
      cb();
    });
  }
};
