'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  models.rol_groups.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(dataGroups){
    models.rol_boxes.findAll({
    }).then(function(dataBoxes){
      models.rol_lamels.findAll({
        where: {factory_id: req.session.user.factory_id}
      }).then(function(dataLamels){
          const groups = [];
          
          dataGroups.forEach(gr => {
            const boxByGr = dataBoxes.filter(box => {
              return box.rol_group_id === gr.id
            })
            const objGr = {
              group: gr,
              boxes: boxByGr
            }
            groups.push(objGr);
          })

          // console.log('GR>>>',groups[0].boxes)
          // console.log('LAM>>>',dataLamels)
      
    
        res.render('base/shields/rolet/roletPrice', {
              i18n: i18n,
              title: 'RoletPrice',
              groups: groups,
              lamels: dataLamels,
              cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
              scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/roletPrice.js']
            });
      }).catch(function(err){
        res.send({status: false})
      })

    });
  });
};
