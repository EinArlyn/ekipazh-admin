'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {

  models.rol_end_lists.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(rol_end_lists) {
        models.rol_color_groups.findAll({
          where: {factory_id: req.session.user.factory_id}
        }).then(function(color_groups) {
          models.rol_colors.findAll({
            where: {factory_id: req.session.user.factory_id}
          }).then(function(colors) {
            color_groups.sort((a,b) => a.position - b.position);
            colors.sort((a,b) => a.position - b.position);
          

        res.render('base/shields/rolet/roletEndListColors', {
              i18n: i18n,
              title: 'RoletEndListColors',
              groupsColors: color_groups,
              colorsList: colors,
              endLists: rol_end_lists,
              cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
              scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/roletEndListColors.js']
            });
      }).catch(function(err){
        res.send({status: false})
      })
    });
  });
};
