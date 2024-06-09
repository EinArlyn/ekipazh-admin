'use strict';

var models = require('../../../lib/models');
var _getAvailableSets = require('./utils')._getAvailableSets;

/**
 * Open door folder
 * @param {integer} params.id - Folder id
 */
module.exports = function (req, res) {
  var folderId = req.params.id;

  models.doors_groups.findAll({
    where: {
      folder_id: folderId
    }
  }).then(function (folderGroups) {
    _getAvailableSets(req.session.user.factory_id, function (err, result) {
      if (err) return ({ status: false, error: err });

      res.send({ status: true, groups: folderGroups, default: result });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
