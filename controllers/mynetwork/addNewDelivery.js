var models = require('../../lib/models');

/**
 * Add new delivery
 */
module.exports = function (req, res) {
  var userId = req.params.userId;

  models.users_deliveries.create({
    user_id: parseInt(userId),
    active: 0,
    name: '',
    type: 1,
    price: 0.00
  }).then(function(result) {
    models.users_deliveries.findOne({
      where: {id: result.id}
    }).then(function(delivery) {
      res.send({status: true, delivery: delivery});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}
