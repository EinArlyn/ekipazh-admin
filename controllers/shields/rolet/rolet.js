'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  let groupSystems = [];
    // models.rol_lamels_end_lists.findAll().then(function(data) {
    // console.log('rol_lamels_end_lists>>>> ',data)
    // })
    // models.rol_box_sizes.findAll().then(function(rol_box_sizes) {
    //   console.log('rol_box_sizes>>>> ',rol_box_sizes)
    // })
    // models.rol_boxes.findAll().then(function(rol_boxes) {
    //   console.log('rol_boxes>>>> ',rol_boxes)
    // })
    // models.rol_end_lists.findAll().then(function(rol_end_lists) {
    //   console.log('rol_end_lists>>>> ',rol_end_lists)
    // })
    // models.rol_guides.findAll().then(function(rol_guides) {
    //   console.log('rol_guides>>>> ',rol_guides)
    // })
    // models.rol_lamels_guides.findAll().then(function(rol_lamels_guides) {
    //   console.log('rol_lamels_guides>>>> ',rol_lamels_guides)
    // })
    // models.rol_lamels.findAll().then(function(rol_lamels) {
    //   console.log('rol_lamels>>>> ',rol_lamels)
    // })
    models.rol_groups.findAll({
      where: {factory_id: req.session.user.factory_id},
    }).then(function(rol_groups) {
      if (rol_groups.length) {
        console.log('rol_groups>>>> ',rol_groups)

        groupSystems = rol_groups.sort((a, b) => a.position - b.position);;
      } 
    
      res.render('base/shields/rolet/rolet', {
            i18n: i18n,
            title: 'Rolet',
            groupSystems: groupSystems,
            cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
            scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/rolet.js']
          });
    });
};
