'use strict';

var models = require('../../../lib/models');

module.exports = function (req, res) {
  models.pls_system_groups.findAll({
      where: {factory_id: req.session.user.factory_id},
      order: [['position', 'ASC']]
    }).then(function(dataSystemGroups){
      models.pls_systems.findAll({
      }).then(function(dataSystems){
        models.pls_profile_colors_groups.findAll({
          where: {factory_id: req.session.user.factory_id}
        }).then(function(dataColorGroups){
            const systemGroups = [];
            
            dataSystemGroups.forEach(gr => {
              const systemsByGr = dataSystems.filter(system => {
                return system.group_id === gr.id
              })
              const objGr = {
                group: gr,
                systems: systemsByGr
              }
              systemGroups.push(objGr);
            })      
            
          res.render('base/shields/grids/colorPrices', {
            i18n: res.locals.i18n,
            title: 'Color Prices',
            systemGroups: systemGroups,
            colorGroups: dataColorGroups,
            cssSrcs: ['/assets/stylesheets/base/shields/grids.css'],
            scriptSrcs: [
              '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
              '/assets/javascripts/base/shields/grids/colorPrices.js'
            ]
        });
      });
    });
  });
};