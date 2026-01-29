'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {

  models.rol_groups.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(rol_groups) {
    models.rol_boxes.findAll({}).then(function(rol_boxes) {
      models.rol_color_groups.findAll({
        where: {factory_id: req.session.user.factory_id}
      }).then(function(color_groups) {
        models.rol_colors.findAll({
          where: {factory_id: req.session.user.factory_id}
        }).then(function(colors) {
            models.rol_box_sizes.findAll({}).then(function(sizesBox) {
            
            
            color_groups.sort((a,b) => a.position - b.position);
            colors.sort((a,b) => a.position - b.position);
            
            let boxes = [];
            rol_groups.forEach(group => {
              rol_boxes
                .filter(box => box.rol_group_id === group.id)
                .forEach(box => {
                  box.sizes_box = sizesBox.filter(size => size.id_rol_box === box.id);
                  boxes.push(box)
                });
            });
            


            res.render('base/shields/rolet/roletBoxColors', {
                  i18n: i18n,
                  title: 'RoletBoxColors',
                  groupsColors: color_groups,
                  colorsList: colors,
                  boxes: boxes,
                  cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
                  scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/roletBoxColors.js']
                });
          }).catch(function(err){
            res.send({status: false})
          })
        })
      })
    })
  })
};
