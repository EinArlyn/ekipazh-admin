var async = require('async');
var models = require('../../lib/models');

/**
 * Remove order by id
 * @param {string}  login
 * @param {mixed}   access_token
 * @param {numeric} orderId
 */
module.exports = function(req, res) {
  var login = req.query.login;
  var access_token = req.query.access_token;
  var orderId = req.body.orderId;

  models.users.find({
    where: { phone: login, device_code: access_token }
  }).then(function(user) {
    if (user) {
      async.waterfall([
        /** 1-st: remove all additional elements */
        function(_callback) {
          models.order_addelements.destroy({
            where: {order_id: orderId}
          }).then(function() {
            _callback(null);
          }).catch(function(err) {
            console.log(err);
            _callback(null);
          });
        },
        /** 2-nd: remove all products */
        function(_callback) {
          models.order_products.destroy({
            where: {order_id: orderId}
          }).then(function() {
            _callback(null);
          }).catch(function(err) {
            console.log(err);
            _callback(null);
          });
        },
        /** 3-d: remove order_prices */
        function(_callback) {
          models.order_prices.destroy({
            where: { order_id: orderId }
          }).then(function() {
            _callback(null);
          }).catch(function(err) {
            console.log(err);
            _callback(null);
          });
        },
        /** 4-d: remove order */
        function(_callback) {
          models.orders.destroy({
            where: {id: orderId}
          }).then(function() {
            _callback(null);
          }).catch(function(err) {
            console.log(err);
            _callback(null);
          });
        }
      ], function(err, result) {
        if (err) {
          console.log(err);
          res.send({status: false});
        } else {
          res.send({status: true});
        }
      });
    } else {
      res.send({status: false, error: 'User does not exist.'});
    }
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
};
