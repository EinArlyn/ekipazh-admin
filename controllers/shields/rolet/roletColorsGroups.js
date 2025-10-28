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
  ]
  models.rol_lamels.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(lamelsList) {
    res.render('base/shields/rolet/roletColorsGroups', {
          i18n: i18n,
          title: 'RoletColorsGroups',
          groupsColors: groupsColors,
          colorsList: colorsList,
          cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
          scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/roletColorsGroups.js']
        });
  }).catch(function(err){
    res.send({status: false})
  })
};
