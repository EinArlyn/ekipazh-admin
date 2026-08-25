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

/**
 * Get country NDS by city id via direct SQL join
 * @param {integer} cityId
 * @returns {Promise<number|null>}
 */
function getCountryNdsByCityId(cityId) {
  if (!cityId) {
    return Promise.resolve(null);
  }

  return models.sequelize.query(
    'SELECT CN.nds ' +
    'FROM cities C ' +
    'JOIN regions R ON R.id = C.region_id ' +
    'LEFT JOIN country_nds CN ON CN.country_id = R.country_id ' +
    'WHERE C.id = :cityId ' +
    'LIMIT 1',
    {
      replacements: { cityId: cityId },
      type: models.sequelize.QueryTypes.SELECT
    }
  ).then(function (result) {
    if (!result || !result.length || result[0].nds === null || typeof result[0].nds === 'undefined') {
      return null;
    }

    var countryNds = parseFloat(result[0].nds);

    return isNaN(countryNds) ? 0 : countryNds;
  });
}

exports.getCountryNdsByCityId = getCountryNdsByCityId;
