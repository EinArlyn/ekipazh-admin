'use strict';

var models = require('../../../lib/models');
var _getAvailableSets = require('./utils')._getAvailableSets;

/**
 * Get door group
 */
module.exports = function (req, res) {
  _getAvailableSets(req.session.user.factory_id, function (err, options) {
    if (err) return res.send({ status: false, error: err });

    models.doors_laminations_dependencies.findAll({
      where: {
        group_id: req.params.id
      }
    }).then(function (groupDependecies) {
      res.send({
        status: true,
        dependencies: groupDependecies,
        options: options
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: err });
    });

  });
};
