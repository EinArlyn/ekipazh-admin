'use strict';

var models = require('../../../lib/models');

module.exports = function (req, res) {

  const rulesData = [
    { id: 1, name: 'меньше род на %' },
    { id: 2, name: 'больше род на %' },
    { id: 3, name: 'меньше род на мм'},
    { id: 4, name: 'больше род на мм',},
    // { id: 5, name: 'род меньше на %',},
    // { id: 6, name: 'род больше на %',},
    // { id: 7, name: 'род меньше на мм',},
    // { id: 8, name: 'род больше на мм',},
    { id: 9, name: 'шт на родителя',},
    { id: 10, name: '1шт каждые мм',},
  ]
    
  models.pls_elements.findAll({
      where: { factory_id: req.session.user.factory_id },
      raw: true
  }).then(function(elements) {    
    models.pls_links.findAll({
        where: { parent_type_id: 3 },
        raw: true
      }).then(function (links) {

      elements.forEach(function (elem) {
        const elementsLinks = links.filter(function (link) {
          return link.parent_id === elem.id;
        });

        elem.elements = elementsLinks.map(function (link) {
          const element = elements.find(function (e) {
            return e.id === link.element_id;
          });

          if (!element) {
            return null;
          }

          return Object.assign({}, element, {
            rules_id: link.rules_id,
            rules_value: link.rules_value
          });
        }).filter(Boolean);
      });


      elements.sort((a, b) => a.id - b.id);
      res.render('base/shields/grids/elements', {
        i18n: res.locals.i18n,
        title: 'Elements',
        // groupSystems: groupSystems,
        elements: elements,
        rulesData: rulesData,
        cssSrcs: ['/assets/stylesheets/base/shields/grids.css'],
        scriptSrcs: [
          '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
          '/assets/javascripts/base/shields/grids/elements.js'
        ]
      });
    });
  });
};