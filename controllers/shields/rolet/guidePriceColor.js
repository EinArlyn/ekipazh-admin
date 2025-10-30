'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  models.rol_guides.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(dataGuides){
      models.rol_color_groups.findAll({
        where: { factory_id: req.session.user.factory_id }
      }).then(function (colorGroups) {
        models.rol_price_rules.findAll({}).then(function(priceRules){
        
        const filterColorGroups = colorGroups.filter(cg => cg.is_standart === 0);
        filterColorGroups.sort((a, b) => a.position - b.position);
            
    
        res.render('base/shields/rolet/guidePriceColor', {
              i18n: i18n,
              title: 'GuidePriceColor',
              guides: dataGuides,
              colorGroups: filterColorGroups,
              priceRules: priceRules,
              cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
              scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/guidePriceColor.js']
            });
      }).catch(function(err){
        res.send({status: false})
      })
    });
  });
};
