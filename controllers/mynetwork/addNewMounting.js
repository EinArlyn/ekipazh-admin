var models = require('../../lib/models');

/**
 * Add new mounting for user
 */
module.exports = function (req, res) {
  var userId = req.params.userId;

  models.users_mountings.create({
    user_id: parseInt(userId),
    active: 0,
    name: '',
    type: 1,
    price: 0.00
  }).then(function(result) {
    models.users_mountings.findOne({
      where: {
        id: result.id
      }
    }).then(function(mounting) {
      res.send({ status: true, mounting: mounting });
    }).catch(function(err) {
      console.log(err);
      res.send({ status: false });
    });
  }).catch(function(err) {
    console.log(err);
    res.send({ status: false });
  });
}
