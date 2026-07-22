'use strict';

var models = require('../../../lib/models');

module.exports = function (req, res) {
    
  models.pls_system_groups.findAll({
    where: { factory_id: req.session.user.factory_id }
  }).then(function(groups) {    
    models.pls_systems.findAll({}).then(function(systems) {
      groups.forEach((group) => {
        group.systems = systems.filter(function(system) {
          return system.group_id === group.id;
        }).sort((a, b) => a.position - b.position);
      });

      groups.sort((a, b) => a.position - b.position);
      
      
      res.render('base/shields/grids/systems', {
        i18n: res.locals.i18n,
        title: 'Systems',
        groups: groups,
        cssSrcs: ['/assets/stylesheets/base/shields/grids.css'],
        scriptSrcs: [
          '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
          '/assets/javascripts/base/shields/grids/systems.js'
        ]
      });
    });
  });
};