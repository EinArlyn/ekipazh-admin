var async = require('async');
var models = require('../../lib/models');

module.exports = function(req, res) {
  var login = req.query.login;
  var access_token = req.query.access_token;

  models.users.find({
    where: {phone: login, device_code: access_token}
  }).then(function(user) {
    var tables = {};

    if (user.user_type == 8)
    {
      async.parallel([
        function(callback) {
          /** countries */
          models.countries.findAll()
              .then(function(countries) {
              tables.countries = {};
              tables.countries.fields = ['modified', 'currency_id', 'name', 'id'];
              sortValues(countries, function(values) {
                tables.countries.rows = values;
                callback(null);
              });
            });
        },
        function(callback) {
          /** regions */
          models.regions.findAll()
            .then(function(regions) {
              tables.regions = {};
              tables.regions.fields = ['modified', 'climatic_zone', 'heat_transfer', 'country_id', 'name', 'id'];
              sortValues(regions, function(values) {
                tables.regions.rows = values;
                callback(null);
              });
            });
        },
        function(callback) {
          /** cities */
          models.cities.findAll({where: {id: user.city_id}})
            .then(function(cities) {
              tables.cities = {};
              tables.cities.fields = ['price_koef_id', 'area_id', 'name_sync', 'code_sync', 'is_capital', 'long', 'lat', 'modified', 'transport', 'name', 'region_id', 'id'];
              sortValues(cities, function(values) {
                tables.cities.rows = values;
                callback(null);
              });
            });
        },
        function(callback) {
          /** areas */
          models.areas.findAll()
            .then(function(areas) {
              tables.areas = {};
              tables.areas.fields = ['modified', 'region_id', 'name', 'id'];
              sortValues(areas, function(values) {
                tables.areas.rows = values;
                console.log('AREAS', tables.areas);
                callback(null);
              });
            });
        }
      ], function (err, results) {
        if (err) {
          console.log(err);
          res.send({status: false, error: 'Failed to get locations.'});
        } else {
          res.send({status: true, tables: tables});
        }
      });
    }
    else
    {
      async.parallel([
        function(callback) {
          /** countries */
          models.countries.findAll()
            .then(function(countries) {
              tables.countries = {};
              tables.countries.fields = ['modified', 'currency_id', 'name', 'id'];
              sortValues(countries, function(values) {
                tables.countries.rows = values;
                callback(null);
              });
            });
        },
        function(callback) {
          /** regions */
          models.regions.findAll()
            .then(function(regions) {
              tables.regions = {};
              tables.regions.fields = ['modified', 'climatic_zone', 'heat_transfer', 'country_id', 'name', 'id'];
              sortValues(regions, function(values) {
                tables.regions.rows = values;
                callback(null);
              });
            });
        },
        function(callback) {
          /** cities */
          models.cities.findAll()
            .then(function(cities) {
              tables.cities = {};
              tables.cities.fields = ['price_koef_id', 'area_id', 'name_sync', 'code_sync', 'is_capital', 'long', 'lat', 'modified', 'transport', 'name', 'region_id', 'id'];
              sortValues(cities, function(values) {
                tables.cities.rows = values;
                callback(null);
              });
            });
        },
        function(callback) {
          /** areas */
          models.areas.findAll()
            .then(function(areas) {
              tables.areas = {};
              tables.areas.fields = ['modified', 'region_id', 'name', 'id'];
              sortValues(areas, function(values) {
                tables.areas.rows = values;
                console.log('AREAS', tables.areas);
                callback(null);
              });
            });
        }
      ], function (err, results) {
        if (err) {
          console.log(err);
          res.send({status: false, error: 'Failed to get locations.'});
        } else {
          res.send({status: true, tables: tables});
        }
      });
    }	
  });
};

function sortValues(result, __callback) {
  var values = [];

  if (result.length) {
    for (var i = 0, len = result.length; i < len; i++) {
      var _val = Object.keys(result[i].dataValues).map(function(key) {return result[i][key];});
      values.push(_val);
      if (i === len - 1) {
        __callback(values);
      }
    }
  } else {
    __callback(values)
  }
}

function sortQueries(result, __callback) {
  var values = [];

  if (result.length) {
    for (var i = 0, len = result.length; i < len; i++) {
      var _val = Object.keys(result[i]).map(function(key) {return result[i][key];});
      values.push(_val);
      if (i === len - 1) {
        __callback(values);
      }
    }
  } else {
    __callback(values)
  }
}
