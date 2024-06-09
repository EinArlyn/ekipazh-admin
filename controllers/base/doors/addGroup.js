'use strict';

var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser.js').parseForm;
var _getAvailableSets = require('./utils')._getAvailableSets;

/**
 * Add new door group
 * @param {integer} body.folder_id - Folder id
 * @param {string} body.name - New group name
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) return res.send({ status: false, error: err });

    models.doors_groups.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      folder_id: parseInt(fields.folder_id, 10),
      name: fields.name,
      modified: new Date(),
      code_sync_white: null,
      shtulp_list_id: 0,
      impost_list_id: 0,
      stvorka_list_id: 0,
      door_sill_list_id: 0,
      rama_list_id: 0,
      rama_sill_list_id: 0
    }).then(function (newGroup) {
      _getAvailableSets(req.session.user.factory_id, function (err, result) {
        if (err) return ({ status: false, error: err });

        res.send({ status: true, group: newGroup, default: result });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  });
};
