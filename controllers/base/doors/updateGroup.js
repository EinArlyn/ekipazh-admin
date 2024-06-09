'use strict';

var models = require('../../../lib/models');

/**
 * Update door group
 * @param {integer} body.folderId - Folder id
 * @param {string} body.field - Group field
 * @param {integer} body.value - New value
 */
module.exports = function (req, res) {
  models.doors_groups.find({
    where: {
      id: req.body.folderId
    }
  }).then(function (group) {
    var updateObj = {};
    updateObj[req.body.field] = parseInt(req.body.value, 10);

    group.updateAttributes(updateObj).then(function () {
      res.send({ status: true });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
