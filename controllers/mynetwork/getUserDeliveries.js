var models = require('../../lib/models');

/**
 * Get user deliveries by user id
 * @param {integer}  userId
 */
module.exports = function (req, res) {
  var userId = req.params.userId;

  if (req.session.user.factory_id == userId) {
    models.users_deliveries.findAll({
      where: {user_id: parseInt(userId)},
      order: 'active DESC'
    }).then(function(userDeliveries) {
      res.send({status: true, deliveries: userDeliveries, factoryDeliveries: []});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  } else {
    models.deactivated_deliveries.findAll({
      where: {user_id: parseInt(userId)},
      attributes: ['delivery_id']
    }).then(function(deactivatedDeliveries) {
      var dDeliveries = deactivatedDeliveries.map(function(obj) {
        return obj.dataValues.delivery_id
      });
      console.log(dDeliveries);
      models.users_deliveries.findAll({
        where: {user_id: parseInt(req.session.user.factory_id), active: 1},
        order: 'active DESC'
      }).then(function(factoryDeliveries) {
        models.users_deliveries.findAll({
          where: {user_id: parseInt(userId)},
          order: 'active DESC'
        }).then(function(userDeliveries) {
          res.send({status: true, deliveries: userDeliveries, factoryDeliveries: factoryDeliveries, dDeliveries: dDeliveries});
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
        });
      });
    });
  }
}
