var models = require('../../../lib/models');

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
      title           : res.__('Window glasses'),
      i18n: res.locals.i18n,
      profileSystems  : profile_systems,
      cssSrcs         : ['/assets/stylesheets/base/glazedWindow.css'],
      scriptSrcs      : ['/assets/javascripts/base/glazedWindow.js']
    });
  });
}
