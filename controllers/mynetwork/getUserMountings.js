var models = require('../../lib/models');

module.exports = function (req, res) {
  var userId = req.params.userId;

  if (req.session.user.factory_id == userId) {
    models.users_mountings.findAll({
      where: {user_id: userId},
      order: 'active DESC'
    }).then(function(userMountings) {
      res.send({status: true, mountings: userMountings, factoryMountings: []});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  } else {
    models.deactivated_mountings.findAll({
      where: {user_id: parseInt(userId)},
      attributes: ['mounting_id']
    }).then(function(deactivatedMountings) {
      var dMountings = deactivatedMountings.map(function(obj) {
        return obj.dataValues.mounting_id
      });

      models.users_mountings.findAll({
        where: {user_id: req.session.user.factory_id, active: 1},
        order: 'active DESC'
      }).then(function(factoryMountings) {
        models.users_mountings.findAll({
          where: {user_id: userId},
          order: 'active DESC'
        }).then(function(userMountings) {
          res.send({status: true, mountings: userMountings, factoryMountings: factoryMountings, dMountings: dMountings});
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
        });
      });
    });
  }
}
