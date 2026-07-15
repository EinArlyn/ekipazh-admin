'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
    
  models.pls_profile_colors_groups.findAll({
    where: { factory_id: req.session.user.factory_id }
  }).then(function(groups) {    
    models.pls_profile_colors.findAll({}).then(function(colors) {
      groups.forEach((group) => {
        group.colors = colors.filter(function(color) {
          return color.group_id === group.id;
        }).sort((a, b) => a.position - b.position);
      });

      groups.sort((a, b) => a.position - b.position);
      
      
      res.render('base/shields/grids/colors', {
        i18n: i18n,
        title: 'Colors',
        groups: groups,
        cssSrcs: ['/assets/stylesheets/base/shields/grids.css'],
        scriptSrcs: [
          '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
          '/assets/javascripts/base/shields/grids/colors.js'
        ]
      });
    });
  });
};