'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

/**
 * Get door's hardware group
 */
module.exports = function (req, res) {
  models.doors_hardware_groups.find({
    where: {
      id: req.params.id
    }
  }).then(function (group) {
    res.send({ status: true, group: group });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
