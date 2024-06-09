'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

/**
 * Get door's hardware groups
 */
module.exports = function (req, res) {
  models.doors_hardware_groups.findAll({
    where: {
      hardware_type_id: req.params.hardwareTypeId,
      factory_id: req.session.user.factory_id
    },
    order: ['id']
  }).then(function (groups) {
    res.send({ status: true, groups: groups });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
