var models = require('../../lib/models');

/**
 * Get user discounts by ID
 */
module.exports = function (req, res) {
  var userId = req.params.userId;

  models.users_discounts.find({
    where: {user_id: userId}
  }).then(function(userDiscounts) {
    if (userDiscounts) {
      res.send({status: true, discounts: userDiscounts});
    } else {
      models.users_discounts.create({
        user_id: parseInt(userId)
      }).then(function() {
        models.users_discounts.find({
          where: {user_id: userId}
        }).then(function(userDiscounts) {
          res.send({status: true, discounts: userDiscounts});
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
        });
      }).catch(function(err) {
        console.log(err);
        res.send({status: false});
      });
    }
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}
