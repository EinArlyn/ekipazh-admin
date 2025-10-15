'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  let groupSystems = [];
    models.rol_groups.findAll({
      where: {factory_id: req.session.user.factory_id},
    }).then(function(rol_groups) {
      if (rol_groups.length) {
        
        groupSystems = rol_groups.sort((a, b) => a.position - b.position);
        models.rol_boxes.findAll({}).then(function (rol_boxes) {
          if (rol_boxes.length) {
            groupSystems.forEach(group => {
              const boxesByGroup = rol_boxes.filter(box => box.rol_group_id === group.id);
              if (boxesByGroup.length) {
                group.systems = boxesByGroup.sort((a,b) => a.position - b.position);
              }
            })
          }
    
          res.render('base/shields/rolet/rolet', {
              i18n: i18n,
              title: 'Rolet',
              groupSystems: groupSystems,
              cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
              scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/rolet.js']
            });
        })
      } else {
         res.render('base/shields/rolet/rolet', {
              i18n: i18n,
              title: 'Rolet',
              groupSystems: groupSystems,
              cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
              scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/rolet.js']
            });
      }
    });
};
