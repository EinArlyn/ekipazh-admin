'use strict';

var models = require('../../../lib/models');

/**
 * Add lock list
 */
module.exports = function (req, res) {
  var groupId = req.body.groupId;
  var lockSetId = req.body.lockSetId;

  models.lock_lists.create({
    list_id: parseInt(lockSetId, 10),
    group_id: parseInt(groupId, 10),
    modified: new Date()
  }).then(function (newLockList) {
    res.send({ status: true, newLockList: newLockList });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
