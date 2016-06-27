'use strict';

var async = require('async');
var _ = require('lodash');
var notate = require('@scottnonnenberg/notate');

var userId = 4;


function callRemoteService(userId, cb) {
  setTimeout(function() {
    if (_.random(0, 10) < 3) {
      return cb(new Error('Incorrect arguments supplied'));
    }
    return cb();
  });
};

function step1(cb) {
  callRemoteService(userId, function afterStep1(err) {
    if (notate(cb, err)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

function step2(cb) {
  callRemoteService(userId, function afterStep2(err) {
    if (notate(cb, err)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

function step3(cb) {
  callRemoteService(userId, function afterStep3(err) {
    if (notate(cb, err)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

function step4(cb) {
  callRemoteService(userId, function afterStep4(err) {
    if (notate(cb, err)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

function step5(cb) {
  callRemoteService(userId, function afterStep5(err) {
    if (notate(cb, err)) {
      return;
    }

    // do domain-specific stuff
    return cb();
  });
};

function fiveSteps(param, cb) {
  async.series([
    step1,
    step2,
    step3,
    step4,
    step5
  ], function afterFiveSteps(err) {
    if (notate(cb, err)) {
      return;
    }

    // do domain-specific stuff

    return cb();
  });
};

if (require.main === module) {
  fiveSteps('param', function(err) {
    if (!err) {
      return;
    }

    console.log('message:');
    console.log(err.message)

    console.log('\nstack:');
    console.log(err.stack);

    console.log('\nprettyPrint:');
    console.log(notate.prettyPrint(err));
  });
}
