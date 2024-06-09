'use strict';

var models = require('../../../lib/models');
var _getAvailableSets = require('./utils')._getAvailableSets;

/**
 * Get default option (sets, laminations)
 */
module.exports = function (req, res) {
  _getAvailableSets(req.session.user.factory_id, function (err, result) {
    if (err) return ({ status: false, error: err });

    res.send({ status: true, options: result });
  });
};
