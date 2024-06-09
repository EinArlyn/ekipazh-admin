'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');
var _getAvailableSets = require('./utils')._getAvailableSets;

/**
 * Get doors
 */
module.exports = function (req, res) {
  /** Get door folders */
  models.doors_folders.findAll({
    where: {
      factory_id: req.session.user.factory_id
    },
    order: ['id']
  }).then(function (doorFolders) {
    var defaultFolderId = _getDefaultDoorFolderId(doorFolders);

    /** Get door groups without folders */
    models.doors_groups.findAll({
      where: {
        factory_id: req.session.user.factory_id,
        folder_id: defaultFolderId
      },
      order: ['id']
    }).then(function (doorGroups) {
      _getAvailableSets(req.session.user.factory_id, function (err, result) {
        if (err) return res.send('Internal server error.');

        res.render('base/doors', {
          i18n: i18n,
          title: i18n.__('Doors'),
          doorFolders: doorFolders,
          doorGroups: doorGroups,
          defaultFolderId: defaultFolderId,
          frameLists: result.frameLists,
          doorSillLists: result.doorSillLists,
          impostLists: result.impostLists,
          shtulpLists: result.shtulpLists,
          frameBottomLists: result.frameBottomLists,
          leafs: result.leafs,
          cssSrcs: ['/assets/stylesheets/base/index.css', '/assets/stylesheets/base/doors.css'],
          scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/doors.js']
        });
      });
    }).catch(function (error) {
      console.log(error);
      res.send('Internal server error');
    });
  }).catch(function (error) {
    console.log(error);
    res.send('Internal server error.');
  });
};

function _getDefaultDoorFolderId (doorFolders) {
  return doorFolders.filter(function (folder) {
    return folder.dataValues.type === 0;
  })[0].id;
}
