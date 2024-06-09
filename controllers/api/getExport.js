var async = require('async');
var models = require('../../lib/models');
var exportService = require('../../lib/services/exportOrder');

module.exports = function(req, res) {
  var login = req.query.login;
  var access_token = req.query.access_token;

  models.users.find({
    where: {phone: login, device_code: access_token}
  }).then(function(user) {
    if (!user) return res.send({ status: false, error: 'User does not exist' });

    exportService(req.query.orderId, function (error) {
      if (error) return res.send({
        status: false,
        error: 'Order does not exist.'
      });

      res.send({
        status: true
      });
    });
  });
};
