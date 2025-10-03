'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  const endLists = [
    { 
      name: 'List 1',
      id:1
     },
    { 
      name: 'List 2',
      id:2 
     },
    { 
      name: 'List 3',
      id:3,
      
     },
  ]
  res.render('base/shields/rolet/endLists', {
        i18n: i18n,
        title: 'End Lists',
        endLists: endLists,
        cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
        scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/endLists.js']
      });
};
