var models = require('../../lib/models');

/**
 * Change order factory number
 * @param {numeric} params.id - Order Id
 * @param {string} body.newFactoryNumber
 */
module.exports = function (req, res) {
  var orderId = req.params.id;
  var newFactoryNumber = req.body.newFactoryNumber;

  models.orders.find({
    where: { id: orderId }
  }).then(function (order) {
    order.updateAttributes({
      order_hz: newFactoryNumber
    }).then(function () {
      res.send({ status: true });
    }).catch(function (err) {
      console.log(err);
      res.send({ status: false });
    });
  }).catch(function (err) {
    console.log(err);
    res.send({ status: false });
  });
}
