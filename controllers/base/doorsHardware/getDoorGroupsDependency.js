'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

/**
 * Get door's groups dependencies
 */
module.exports = function (req, res) {
  models.doors_groups_dependencies.findAll({
    where: {
      hardware_group_id: req.params.hardwareGroupId
    }
  }).then(function (doorsGroupsDependencies) {
    var dependenciesGroupsIds = doorsGroupsDependencies.map(function (dependency) {
      return dependency.dataValues.doors_group_id;
    });

    dependenciesGroupsIds.push(-1);

    models.doors_groups.findAll({
      where: {
        factory_id: req.session.user.factory_id
      }
    }).then(function (doorsGroups) {
      res.send({
        status: true,
        dependenciesGroupsIds: dependenciesGroupsIds,
        doorsGroups: doorsGroups
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
