'use strict';

var models = require('../../../lib/models');

/**
 * Update door dependency
 * @param {integer} body.dependencyId - Dependency id
 * @param {string} body.field - Dependency field
 * @param {integer} body.value - New value
 */
module.exports = function (req, res) {
  models.doors_laminations_dependencies.find({
    where: {
      id: req.body.dependencyId
    }
  }).then(function (dependency) {
    var updateObj = {};
    updateObj[req.body.field] = parseInt(req.body.value, 10);

    dependency.updateAttributes(updateObj).then(function () {
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
