'use strict';

var models = require('../../../lib/models');

module.exports = function (req, res) {
    
  const groups = [
    {
      id: 1,
      name: 'Обычные окна',
    },
    {
      id: 2,
      name: 'Двери',
    },
    {
      id: 3,
      name: 'Раздвижные',
    }
  ];

  models.pls_templates.findAll({
    order: [['position', 'ASC']]
  }).then(function (templates) {

    groups.forEach(function (group) {
      group.templates = templates.filter(function (template) {
        return template.construction_type === Number(group.id);
      });
    });
      
      
    res.render('base/shields/grids/templates', {
      i18n: res.locals.i18n,
      title: 'Templates',
      groups: groups,
      cssSrcs: ['/assets/stylesheets/base/shields/grids.css'],
      scriptSrcs: [
        '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
        '/assets/javascripts/base/shields/grids/templates.js'
      ]
    });
  });
};