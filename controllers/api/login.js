var models = require('../../lib/models');

module.exports = function(req, res) {
  var type = req.query.type;
  var login = req.body.login;
  var whereQuery = {};

  if (!type) {
    whereQuery.phone = login;
  } else {
    whereQuery.device_code = login;
  }

  models.users.find({
    where: whereQuery,
    attributes: ['id', 'email', 'password', 'short_id', 'factory_id', 'name', 'phone', 'locked', 'user_type', 'city_phone', 'city_id', 'avatar', 'birthday', 'sex', 'device_code', 'modified', 'address', 'last_sync', 'code_sync', 'currencies_id']
  }).then(function(user) {
    if (user) {
      res.send({
        status: true,
        user: user
      });
    } else {
      res.send({status: false});
    }
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}
