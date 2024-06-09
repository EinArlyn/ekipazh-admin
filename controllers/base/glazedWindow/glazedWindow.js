var models = require('../../../lib/models');
var i18n = require('i18n');

/**
 * Get glazed window dependencies
 */
module.exports = function (req, res) {
  models.profile_systems.findAll({
    include: [{
      model: models.profile_system_folders,
      where: {
        factory_id: req.session.user.factory_id
      }
    }]
  }).then(function (profile_systems) {
    res.render('base/glazedWindow', {
      title           : i18n.__('Window glasses'),
      i18n            : i18n,
      profileSystems  : profile_systems,
      cssSrcs         : ['/assets/stylesheets/base/glazedWindow.css'],
      scriptSrcs      : ['/assets/javascripts/base/glazedWindow.js']
    });
  });
}
