var models = require('../../../lib/models');
var i18n = require('i18n');

/**
 * Get element
 * @param {integer} params.id - Element Id
 */
module.exports = function (req, res) {
  var id = req.params.id;

  models.elements.find({
    where: { id: id },
    include: [
      { model: models.currencies },
      { model: models.elements_groups },
      { model: models.lists, include: [{ model: models.lists_groups }] },
      { model: models.glass_folders },
      { model: models.suppliers }
    ]
  }).then(function (element) {
    models.elements_groups.findAll({
      order: 'name'
    }).then(function (elements_groups) {
      models.lists_groups.findAll({
        order: 'name'
      }).then(function (lists) {
        models.suppliers.findAll({
          where: { factory_id: element.factory_id },
          order: 'name'
        }).then(function (suppliers) {
          models.currencies.findAll({
            where: {
              factory_id: element.factory_id
            }
          }).then(function (currencies) {
            models.profile_systems.findAll({
              include: [{
                model: models.profile_system_folders,
                where: { factory_id: element.factory_id }
              }, {
                model: models.elements_profile_systems
              }],
              order: 'id'
            }).then(function (profile_systems) {
              models.elements_profile_systems.findAll({
                where: { element_id: element.id },
                attributes: ['element_id', 'profile_system_id'],
                order: 'id'
              }).then(function (element_profile_systems) {
                /** Get array of profile systems ids, that relates to element */
                var filteredProfiles = [];

                element_profile_systems.filter(function (child) {
                  if (child.element_id === element.id) {
                    filteredProfiles.push(child.profile_system_id);
                  }
                });

                models.lamination_default_colors.findAll({
                  order: 'id'
                }).then(function (defaultLaminations) {
                  models.glass_folders.findAll({
                    where: { factory_id: req.session.user.factory_id }
                  }).then(function (glass_folders) {
                    models.factories.find({
                      where: { id: req.session.user.factory_id },
                      attributes: ['therm_coeff_id']
                    }).then(function (factory) {

                      models.glasses_folders.findAll({
                        where: { element_id: element.id },
                        attributes: ['element_id', 'glass_folders_id']
                      }).then(function (glasses_folders) {
                          var filteredGlassesFolders = [];

                          glasses_folders.filter(function (child) {
                            if (child.element_id === element.id) {
                              filteredGlassesFolders.push(child.glass_folders_id);
                            }
                          });                      

                        res.render('base/element', {
                          i18n                    : i18n,
                          title                   : i18n.__('Edit element'),
                          element                 : element,
                          elements_groups         : elements_groups,
                          lists                   : lists,
                          suppliers               : suppliers,
                          glass_folders           : glass_folders,
                          currencies              : currencies,
                          profile_systems         : profile_systems,
                          filteredProfiles        : filteredProfiles,
                          filteredGlassesFolders  : filteredGlassesFolders,
                          defaultLaminations      : defaultLaminations,
                          usedCoeff               : factory.therm_coeff_id,
                          thisPageLink            : '/base/elements/',
                          cssSrcs                 : ['/assets/stylesheets/base/element.css'],
                          scriptSrcs              : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
                                                    '/assets/javascripts/base/element.js']
                        });

                      }).catch(function (err) {
                        console.log(err);
                        res.send('Internal server error.');
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};
