'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  models.rol_guides.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(guidesList){
    
    res.render('base/shields/rolet/guides', {
          i18n: i18n,
          title: 'Guides',
          guidesList: guidesList,
          cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
          scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/guides.js']
        });
  })
};
