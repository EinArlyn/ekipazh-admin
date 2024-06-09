var models = require('../../lib/models');
var exportOrder = require('../../lib/services/exportOrder');
var utcService = require('../../lib/services/timezone');

/**
 * Update attributes
 * @param {integer} id                              Order id
 * @param {string} state                            Order column
 * @param {date without timezone || null} value     Field value
 */
module.exports = function (req, res) {
  var orderId = req.body.orderId;
  var state = req.body.state;
  var value = (new Date(req.body.value).getTime() === new Date(0).getTime() ? new Date(0) : utcService(new Date()));
  console.log('utc check', value);
  var update = {};
  update[state] = value || new Date(0);

  if (state === 'sended' && new Date(update[state]) > new Date(0)) {
    exportOrder(orderId, function (err) {
      if (err) return res.send({ status: false, error: err });
      models.orders.find({
        where: { id: orderId }
      }).then(function (order) {
        order.updateAttributes(update).then(function (result) {
          console.log('result', result.sended);
          res.send({ status: true });
        });
      });
    });
  } else {
    models.orders.find({
      where: { id: orderId }
    }).then(function (order) {
      order.updateAttributes(update).then(function (result) {
        res.send({ status: true });
      });
    });
  }
};
