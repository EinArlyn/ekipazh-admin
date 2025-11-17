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
        models.rol_control_groups.findAll({
          where: {factory_id: req.session.user.factory_id}
        }).then(function(dataControlGroups) {
          models.rol_controls.findAll({
            where: { factory_id: req.session.user.factory_id }
          }).then(function (controls) {

              const filterControls = controls.sort((a, b) => a.position - b.position);

              const boxesAddSizes = dataBoxes.map(box => {
                const sizes = boxSizes.filter(size => size.id_rol_box === box.id);
                box.sizes = sizes;
                return box;
              });

              const controlGroups = dataControlGroups.map(gr => ({
                crGroup: gr,
                controls: filterControls.filter(cr => cr.rol_control_group_id === gr.id)
              }));

              const groups = dataGroups.map(gr => ({
                group: gr,
                boxes: boxesAddSizes.filter(box => box.rol_group_id === gr.id)
              }));    
          
              res.render('base/shields/rolet/controlBoxSizes', {
                    i18n: i18n,
                    title: 'ControlBoxSizes',
                    groups: groups,
                    // controls: filterControls,
                    controlGroups: controlGroups,
                    cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
                    scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/controlBoxSizes.js']
                  });
            }).catch(function(err){
              res.send({status: false})
          });
        });
      });
    });
  });
};
