var async = require('async');
var models = require('../../lib/models');

/**
 * Delete user from DB
 * @param {integer} id   User id
 */
module.exports = function (req, res) {
  var userId = req.params.userId;

  async.waterfall([
    function (__callback) {
      /** Remove user accesses */
      models.users_accesses.findAll({
        where: {user_id: userId}
      }).then(function(userAccess) {
        if (userAccess.length) {
          for (var i = 0, len = userAccess.length; i < len; i++) {
            userAccess[i].destroy().then(function() {});
          }
          __callback(null);
        } else {
          __callback(null);
        }
      }).catch(function(err) {
        console.log(err);
        __callback(null);
      });
    },
    function (__callback) {
      /** Remove user deliveries */
      models.users_deliveries.findAll({
        where: {user_id: userId}
      }).then(function(userDeliveries) {
        if (userDeliveries.length) {
          for (var i = 0, len = userDeliveries.length; i < len; i++) {
            userDeliveries[i].destroy().then(function(){});
          }
          __callback(null);
        } else {
          __callback(null);
        }
      }).catch(function(err) {
        console.log(err);
        __callback(null);
      });
    },
    function (__callback) {
      /** Remove user discounts */
      models.users_discounts.findAll({
        where: {user_id: userId}
      }).then(function(userDiscounts) {
        if (userDiscounts.length) {
          for (var i = 0, len = userDiscounts.length; i < len; i++) {
            userDiscounts[i].destroy().then(function() {});
          }
          __callback(null);
        } else {
          __callback(null);
        }
      }).catch(function(err) {
        console.log(err);
        __callback(null);
      });
    },
    function (__callback) {
      /** Remove user mountings */
      models.users_mountings.findAll({
        where: {user_id: userId}
      }).then(function(userMountings) {
        if (userMountings.length) {
          for (var i = 0, len = userMountings.length; i < len; i++) {
            userMountings[i].destroy().then(function() {});
          }
          __callback(null);
        } else {
          __callback(null);
        }
      }).catch(function(err) {
        console.log(err);
        __callback(null);
      });
    }
  ], function (err) {
    /** Remove user */
    models.users.findOne({
      where: {id: userId}
    }).then(function(user) {
      user.destroy().then(function() {
        res.send({status: true});
      }).catch(function(err) {
        console.log(err);
        res.send({status: false});
      });
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  });
}
