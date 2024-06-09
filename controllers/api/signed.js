var models = require('../../lib/models');
var initSession = require('../../lib/services/authentication').initSession;

/**
 * If user is signed in - push server for creating session
 * @param {string}       login          This is user login
 * @param {string}       access_token   User access token
 */
module.exports = function (req, res) {
  var login = req.query.login;
  var access_token = req.query.access_token;
  var date = req.query.date;

  models.users.find({
    where: {
      phone: login,
      device_code: access_token
    }
  }).then(function (user) {
    if (!user) return res.send({ status: false });

    initSession(user);
    res.send({ status: true });
  }).catch(function(error) {
    console.log(error);
    res.send({ status: false });
  });
};
