'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  const groupSystems = [
    { 
      name: 'Короба 1',
      id:1,
      systems: [
        { name: 'Короб 1.1', id: 11 },
        { name: 'Короб 1.2', id: 12 },
        { name: 'Короб 1.3', id: 13 },
      ]
     },
    { 
      name: 'Короба 2',
      id:2,
      systems: [
        { name: 'Короб 2.1', id: 21 },
        { name: 'Короб 2.2', id: 22 },
        { name: 'Короб 2.3', id: 23 },
      ] 
     },
    { 
      name: 'Короба 3',
      id:3,
      
     },
  ]
  res.render('base/shields/rolet/rolet', {
        i18n: i18n,
        title: 'Rolet',
        groupSystems: groupSystems,
        cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
        scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/rolet.js']
      });
};
