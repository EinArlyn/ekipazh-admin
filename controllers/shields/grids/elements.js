'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
    
  models.pls_elements.findAll({
      where: { factory_id: req.session.user.factory_id }
  }).then(function(elements) {    
    elements.sort((a, b) => a.id - b.id);
    res.render('base/shields/grids/elements', {
      i18n: i18n,
      title: 'Grids',
      // groupSystems: groupSystems,
      elements: elements,
      cssSrcs: ['/assets/stylesheets/base/shields/grids.css'],
      scriptSrcs: [
        '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
        '/assets/javascripts/base/shields/grids/elements.js'
      ]
    });
  });
};