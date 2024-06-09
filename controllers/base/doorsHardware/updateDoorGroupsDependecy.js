'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

/**
 * Update door's groups dependencies
 */
module.exports = function (req, res) {
  var doorGroupId = req.body.doorGroupId;
  var hardwareGroupId = req.body.hardwareGroupId;
  var isChecked = req.body.isChecked;

  if (isChecked === 'false') {
    removeDoorGroupDependency();
  } else {
    addDoorGroupDependency();
  }

  function removeDoorGroupDependency () {
    models.doors_groups_dependencies.find({
      where: {
        hardware_group_id: hardwareGroupId,
        doors_group_id: doorGroupId
      }
    }).then(function (doorGroupDependency) {
      doorGroupDependency.destroy().then(function () {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false, error: error });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  }

  function addDoorGroupDependency () {
    models.doors_groups_dependencies.create({
      hardware_group_id: hardwareGroupId,
      doors_group_id: doorGroupId,
      modified: new Date()
    }).then(function (doorGroupDependency) {
      res.send({ status: true });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  }
};
