var models = require('../../lib/models');

/**
 * Get user discounts by ID
 */
module.exports = function (req, res) {
  var userId = req.params.userId;

  models.users_discounts.find({
    where: {user_id: userId}
  }).then(function(userDiscounts) {

    models.user_margins.find({where: {user_id: userId}}).then(function(user_margins) {
      if (user_margins) {
        if (userDiscounts) {
          res.send({status: true, discounts: userDiscounts, userMargins: user_margins});
        } else {
          models.users_discounts.create({
            user_id: parseInt(userId)
          }).then(function() {
            models.users_discounts.find({
              where: {user_id: userId}
            }).then(function(userDiscounts) {
              res.send({status: true, discounts: userDiscounts, userMargins: user_margins});
            }).catch(function(err) {
              console.log(err);
              res.send({status: false});
            });
          }).catch(function(err) {
            console.log(err);
            res.send({status: false});
          });
        }
      } else {
        models.user_margins.create({
          user_id: parseInt(userId)
        }).then(function() {
          models.user_margins.find({where: {user_id: userId}}).then(function(newUserMargins){
            userMargins = newUserMargins;
            if (userDiscounts) {
              res.send({status: true, discounts: userDiscounts, userMargins: newUserMargins});
            } else {
              models.users_discounts.create({
                user_id: parseInt(userId)
              }).then(function() {
                models.users_discounts.find({
                  where: {user_id: userId}
                }).then(function(userDiscounts) {
                  res.send({status: true, discounts: userDiscounts, userMargins: newUserMargins});
                }).catch(function(err) {
                  console.log(err);
                  res.send({status: false});
                });
              }).catch(function(err) {
                console.log(err);
                res.send({status: false});
              });
            }
          })
        })
      }
    })
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}
