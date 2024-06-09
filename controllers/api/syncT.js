var async = require('async');
var models = require('../../lib/models');

module.exports = function(req, res) {
  var login = req.query.login;
  var access_token = req.query.access_token;

  models.users.find({
    where: {phone: login, device_code: access_token}
  }).then(function(user) {
    var tables = {};
    var lastSync = new Date();
    var userId = user.id;
    var factory_id = user.factory_id;

    async.parallel([
      function(callback) {
      /**glass_prices**/
      models.sequelize.query("SELECT PS.id, PS.element_id, PS.col_1_range, PS.col_1_price, PS.col_2_range_1, PS.col_2_range_2, PS.col_2_price, PS.col_3_range_1, PS.col_3_range_2, PS.col_3_price, PS.col_4_range_1, PS.col_4_range_2, PS.col_4_price, PS.col_5_range, PS.col_5_price, PS.table_width " +
                             "FROM glass_prices PS " +
                             "JOIN elements E " +
                             "ON PS.element_id = E.id " +
                             "WHERE E.factory_id = " + parseInt(factory_id) +
                             " and (PS.col_1_price <>0 or PS.col_2_price <>0 or PS.col_3_price <>0 or PS.col_4_price <>0 or PS.col_5_price <>0)" +
      "").then(function(glass_prices) {
          tables.glass_prices = {};
          tables.glass_prices.fields = ["id", "element_id", 
                                        "col_1_range", "col_1_price", 
                                        "col_2_range_1", "col_2_range_2", "col_2_price", 
                                        "col_3_range_1", "col_3_range_2", "col_3_price", 
                                        "col_4_range_1", "col_4_range_2", "col_4_price", 
                                        "col_5_range", "col_5_price", "table_width"];
          sortQueries(glass_prices[0], function(values) {
            tables.glass_prices.rows = values;
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
