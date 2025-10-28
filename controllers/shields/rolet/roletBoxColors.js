'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {

  const groupsColors = [
    {id: 1, name: 'Group 1'},
    {id: 2, name: 'Group 2'},
    {id: 3, name: 'Group 3'},
  ]

  const colorsList = [
    {id: 1, name: 'Red'},
    {id: 2, name: 'Green'},
    {id: 3, name: 'Blue'},
    {id: 4, name: 'Yellow'},
    {id: 5, name: 'Black'},
    {id: 6, name: 'White'},
    {id: 7, name: 'Gray'},
    {id: 8, name: 'Purple'},
    {id: 9, name: 'Orange'},
    {id: 10, name: 'Pink'},
    {id: 11, name: 'Brown'},
    {id: 12, name: 'Cyan'},
    {id: 13, name: 'Magenta'},
    {id: 14, name: 'Lime'},
    {id: 15, name: 'Maroon'},
    {id: 16, name: 'Navy'},
    {id: 17, name: 'Olive'},
    {id: 18, name: 'Teal'},
    {id: 19, name: 'Silver'},
    {id: 20, name: 'Gold'},
    {id: 21, name: 'Beige'},
    {id: 22, name: 'Coral'},
    {id: 23, name: 'Turquoise'},
    {id: 24, name: 'Violet'},
    {id: 25, name: 'Indigo'},
  ]
  models.rol_groups.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(rol_groups) {
    models.rol_boxes.findAll({

    }).then(function(rol_boxes) {
      
      let boxes = [];
      rol_groups.forEach(group => {
        rol_boxes
          .filter(box => box.rol_group_id === group.id)
          .forEach(box => boxes.push(box));
      });
      

      res.render('base/shields/rolet/roletBoxColors', {
            i18n: i18n,
            title: 'RoletBoxColors',
            groupsColors: groupsColors,
            colorsList: colorsList,
            boxes: boxes,
            cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
            scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/roletBoxColors.js']
          });
    }).catch(function(err){
      res.send({status: false})
    })
  })
};
