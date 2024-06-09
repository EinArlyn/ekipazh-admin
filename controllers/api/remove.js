var models = require('../../lib/models');

/**
 * Remove row by id
 * @param {string}  login
 * @param {mixed}   access_token
 * @param {integer/numeric} rowId
 * @param {string} model
 */
module.exports = function(req, res) {
  var login = req.query.login;
  var access_token = req.query.access_token;
  var orderId = req.body.rowId;
  var productId = req.body.productId;
  var model = req.body.model;

  models.users.find({
    where: { phone: login, device_code: access_token }
  }).then(function (user) {
    if (!user) return res.send({ status: false, error: 'User doesn\'t exist.'});

    models[model].find({
      where: {
        order_id: orderId,
        product_id: productId
      }
    }).then(function (raw) {
      raw.destroy().then(function () {
        res.send({ status: true, data: { order_id: orderId, product_id: productId, model: model } });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false, error: error });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  }).catch(function(error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
