var models = require('../../../lib/models');
var i18n = require('i18n');

/**
 * Create new element
 * @param {integer} params.type -
 */
module.exports = function (req, res) {
  var type = req.params.type;

  models.elements_groups.findAll().then(function (elements_groups) {
    models.lists_groups.findAll().then(function (lists_groups) {
      models.suppliers.findAll({
        where: {
          factory_id: req.session.user.factory_id
        }
      }).then(function (suppliers) {
        models.currencies.findAll({
          where: {
            factory_id: req.session.user.factory_id
          }
        }).then(function (currencies) {
          models.profile_systems.findAll({
            include: [{
              model: models.profile_system_folders,
              where: {
                factory_id: req.session.user.factory_id
              }
            }, {
              model: models.elements_profile_systems
            }]
          }).then(function (profile_systems) {
            models.lamination_default_colors.findAll({
              order: 'id'
            }).then(function (defaultLaminations) {
              models.glass_folders.findAll().then(function (glass_folders) {
                res.render('base/element-add-new', {
                  i18n               : i18n,
                  title              : 'Создание элемента',
                  elements_groups    : elements_groups,
                  type               : type,
                  lists_groups       : lists_groups,
                  suppliers          : suppliers,
                  glass_folders      : glass_folders,
                  currencies         : currencies,
                  profile_systems    : profile_systems,
                  defaultLaminations : defaultLaminations,
                  thisPageLink       : '/base/elements/',
                  cssSrcs            : ['/assets/stylesheets/base/element.css'],
                  scriptSrcs         : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
                                        '/assets/javascripts/base/element-add-new.js']
                });
              });
            });
          });
        });
      });
    });
  });
};
