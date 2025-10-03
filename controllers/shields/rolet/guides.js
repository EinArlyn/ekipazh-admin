'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  const guidesList = [
    { 
      name: 'Guide 1',
      id:1
     },
    { 
      name: 'Guide 2',
      id:2 
     },
    { 
      name: 'Guide 3',
      id:3,
      
     },
  ]
  res.render('base/shields/rolet/guides', {
        i18n: i18n,
        title: 'Guides',
        guidesList: guidesList,
        cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
        scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/guides.js']
      });
};
