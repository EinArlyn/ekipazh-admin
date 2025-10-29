'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {

  models.rol_color_groups.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(groupsColors) {
    models.rol_colors.findAll({
      where: {factory_id: req.session.user.factory_id}
    }).then(function(colorsList) {
        groupsColors.sort((a,b) => a.position - b.position);
        colorsList.sort((a,b) => a.position - b.position);
        res.render('base/shields/rolet/roletColorsGroups', {
              i18n: i18n,
              title: 'RoletColorsGroups',
              groupsColors: groupsColors,
              colorsList: colorsList,
              cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
              scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/roletColorsGroups.js']
            });
        }).catch(function(err){
          res.send({status: false})
        })
  });
};
