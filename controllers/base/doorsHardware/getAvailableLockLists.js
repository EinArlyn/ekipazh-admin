'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

/**
 * Get available lock lists
 */
module.exports = function (req, res) {
  models.sequelize.query('SELECT L.id, L.name ' +
    'FROM lists L ' +
      'JOIN elements E ' +
      'ON L.parent_element_id = E.id ' +
    'WHERE E.factory_id=' + parseInt(req.session.user.factory_id) + ' ' +
      'AND L.list_type_id IN (35, 36, 24, 26)' +
  '').then(function (availableLockLists) {
    res.send({ status: true, availableLockLists: availableLockLists[0] });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
