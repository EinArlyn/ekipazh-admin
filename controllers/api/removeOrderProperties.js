var async = require('async');
var models = require('../../lib/models');

/**
 * Remove order by id
 * @param {string}  login
 * @param {mixed}   access_token
 * @param {numeric} orderId
 */
module.exports = function(req, res) {
  var availableModels = ['order_addelements', 'order_products'];
  var login = req.query.login;
  var access_token = req.query.access_token;
  var model = req.body.model;
  var orderId = req.body.orderId;

  if (availableModels.indexOf(String(model)) < 0) {
    return res.send({ status: false, error: 'model should be addelements or products, not ' + model });
  }

  models.users.find({
    where: { phone: login, device_code: access_token }
  }).then(function(user) {
    if (user) {
      models[model].destroy({
        where: {
          order_id: orderId
        }
      }).then(function() {
        res.send({status: true});
      }).catch(function(error) {
        console.log(error);
        res.send({status: false, error: error});
      });
    } else {
      res.send({status: false, error: 'User does not exist.'});
    }
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
};
