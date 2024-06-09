var models = require('../models');

/**
 * Init location by city id
 * @param {integer} city id,
 * @param {function} callback on result
 */
function initLocation (cityId, cb) {
  models.cities.find({
    where: {
      id: cityId
    },
    attributes: ['id', 'region_id']
  }).then(function (city) {
    models.regions.find({
      where: {
        id: city.region_id
      },
      attributes: ['id', 'country_id']
    }).then(function (region) {
      models.countries.findAll({
        order: 'name'
      }).then(function (countries) {
        models.regions.findAll({
          where: {
            country_id: region.country_id
          },
          order: 'name'
        }).then(function (regions) {
          models.cities.findAll({
            where: {
              region_id: city.region_id
            },
            order: 'name'
          }).then(function (cities) {
            cb(null, {
              cityId: cityId,
              regionId: city.region_id,
              countryId: region.country_id,
              countries: countries,
              regions: regions,
              cities: cities
            });
          }).catch(function (error) {
            cb(error);
          });
        }).catch(function (error) {
          cb(error);
        });
      }).catch(function (error) {
        cb(error);
      });
    }).catch(function (error) {
      cb(error);
    });
  }).catch(function (error) {
    cb(error);
  });
}

exports.initLocation = initLocation; 
