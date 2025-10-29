'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {

  models.rol_lamels.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(rol_lamels) {
        models.rol_color_groups.findAll({
          where: {factory_id: req.session.user.factory_id}
        }).then(function(color_groups) {
          models.rol_colors.findAll({
            where: {factory_id: req.session.user.factory_id}
          }).then(function(colors) {
            color_groups.sort((a,b) => a.position - b.position);
            colors.sort((a,b) => a.position - b.position);
      

        res.render('base/shields/rolet/roletLamelColors', {
              i18n: i18n,
              title: 'RoletLamelColors',
              groupsColors: color_groups,
              colorsList: colors,
              lamels: rol_lamels,
              cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
              scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/roletLamelColors.js']
            });
      }).catch(function(err){
        res.send({status: false})
      })
    });
  });
};
