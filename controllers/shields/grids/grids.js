'use strict';

const models = require('../../../lib/models');

module.exports = function (req, res) {

  const rulesData = [
    { id: 1, name: 'меньше род на %' },
    { id: 2, name: 'больше род на %' },
    { id: 3, name: 'меньше род на мм'},
    { id: 4, name: 'больше род на мм',},
    { id: 5, name: 'род меньше на %',},
    { id: 6, name: 'род больше на %',},
    { id: 7, name: 'род меньше на мм',},
    { id: 8, name: 'род больше на мм',},
    { id: 9, name: 'шт на родителя',},
    { id: 10, name: '1шт каждые мм',},
  ]

  models.pls_grids.findAll({
    where: {
      factory_id: req.session.user.factory_id
    },
    raw: true
  }).then(function (grids) {
    models.pls_elements.findAll({
      where: {
        factory_id: req.session.user.factory_id
      },
      raw: true
    }).then(function (elements) {
      models.pls_links.findAll({
        where: {
          parent_type_id: 2
        },
        raw: true
      }).then(function (links) {

        grids.forEach(function (grid) {
          const gridLinks = links.filter(function (link) {
            return link.parent_id === grid.id;
          });

          grid.elements = gridLinks.map(function (link) {
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

        res.render('base/shields/grids/grids', {
          i18n: res.locals.i18n,
          title: 'Grids',
          grids: grids,
          rulesData: rulesData,
          cssSrcs: ['/assets/stylesheets/base/shields/grids.css'],
          scriptSrcs: [
            '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
            '/assets/javascripts/base/shields/grids/grids.js'
          ]
        });
      });
    });
  });

};