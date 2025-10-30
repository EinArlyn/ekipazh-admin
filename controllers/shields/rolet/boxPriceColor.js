'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  models.rol_groups.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(dataGroups){
    models.rol_boxes.findAll({
    }).then(function(dataBoxes){
      models.rol_box_sizes.findAll({}).then(function(boxSizes){
        models.rol_color_groups.findAll({
          where: { factory_id: req.session.user.factory_id }
        }).then(function (colorGroups) {
          models.rol_price_rules.findAll({}).then(function(priceRules){

            const filterColorGroups = colorGroups.filter(cg => cg.is_standart === 0);
            filterColorGroups.sort((a, b) => a.position - b.position);

            const boxesAddSizes = dataBoxes.map(box => {
              const sizes = boxSizes.filter(size => size.id_rol_box === box.id);
              box.sizes = sizes;
              return box;
            });

            const groups = dataGroups.map(gr => ({
              group: gr,
              boxes: boxesAddSizes.filter(box => box.rol_group_id === gr.id)
            }));    
        
            res.render('base/shields/rolet/boxPriceColor', {
                  i18n: i18n,
                  title: 'BoxPriceColor',
                  groups: groups,
                  colorGroups: filterColorGroups,
                  priceRules: priceRules,
                  cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
                  scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/boxPriceColor.js']
                });
          }).catch(function(err){
            res.send({status: false})
          })
        })
      })
    });
  });
};
