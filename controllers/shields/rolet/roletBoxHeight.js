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
        models.rol_box_sizes.findAll().then(function (boxSizes) {    
      
          const boxesAddSizes = dataBoxes.map(box => {
            const sizes = boxSizes.filter(size => size.id_rol_box === box.id);
            box.sizes = sizes.sort((a, b) => a.height - b.height);
            return box;
          });

          const groups = dataGroups.map(gr => ({
            group: gr,
            boxes: boxesAddSizes.filter(box => box.rol_group_id === gr.id)
          }));

          res.render('base/shields/rolet/roletBoxHeight', {
                i18n: i18n,
                title: 'RoletBoxHeight',
                groups: groups,
                lamels: dataLamels,
                cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
                scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/roletBoxHeight.js']
              });
          }).catch(function(err){
            res.send({status: false})
          })
      })
    });
  });
};
