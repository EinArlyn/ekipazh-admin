var models = require('../../lib/models');

/**
 * Deactivate factory delivery
 * @param {integer} userId
 * @param {integer} deliveryId
 */
module.exports = function (req, res) {
  var userId = req.params.userId;
  var deliveryId = req.body.deliveryId;
  var isChecked = req.body.isChecked;

  if (!isChecked || isChecked === 'false') {
    models.deactivated_deliveries.create({
      user_id: parseInt(userId),
      delivery_id: parseInt(deliveryId)
    }).then(function() {
      res.send({ status: true });
    }).catch(function(err) {
      console.log(err);
      res.send({ status: false });
    });
  } else {
    models.deactivated_deliveries.findOne({
      where: {
        user_id: parseInt(userId, 10),
        delivery_id: parseInt(deliveryId, 10)
      }
    }).then(function(deactivatedDelivery) {
      deactivatedDelivery.destroy().then(function() {
        res.send({ status: true });
      }).catch(function(err) {
        console.log(err);
        res.send({ status: false });
      });
    }).catch(function(err) {
      console.log(err);
      res.send({ status: false });
    });
  }
}
