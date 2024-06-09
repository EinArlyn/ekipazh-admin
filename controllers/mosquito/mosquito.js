'use strict';

var i18n = require('i18n');
var models = require('../../lib/models');

module.exports = function (req, res) {
  models.profile_system_folders.findAll({
    where: {
      factory_id: req.session.user.factory_id
    },
    attributes: ['id']
  }).then(function (psFolders) {
    var folders = psFolders.map(function (folder) {
      return folder.dataValues.id
    });

    models.profile_systems.findAll({
      where: {
        folder_id: { $in: folders},
        is_editable: 1
      }
    }).then(function (profileSystems) {
      res.render('base/mosquito', {
        i18n: i18n,
        title: i18n.__('Mosquito nets'),
        profileSystems: profileSystems,
        cssSrcs: ['/assets/stylesheets/base/mosquito.css'],
        scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/mosquito.js']
      });
    }).catch(function (error) {
      console.log(error);
      res.send('Internal server error.');
    });
  }).catch(function (error) {
    console.log(error);
    res.send('Internal server error.')
  });
};
