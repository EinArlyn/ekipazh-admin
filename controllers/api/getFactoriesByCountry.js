var models = require('../../lib/models');

module.exports = function(req, res) {
  var login = req.query.login;
  var factoriesType = [7, 15];
  var access_token = req.query.access_token;
  var citiesId = req.query.cities_ids.split(',');

  console.log(citiesId);
  models.users.find({
    where: {phone: login, device_code: access_token}
  }).then(function(user) {
    if (user) {
      models.users.findAll({
        where: {city_id: {in: citiesId}, user_type: {in: factoriesType}},
        attributes: ['id', 'name', 'city_id']
      }).then(function(factories) {
        res.send({status: true, factories: factories});
      }).catch(function(error) {
        console.dir(error);
        res.send({status: false});
      });
    } else {
      res.send({status: false});
    }
  }).catch(function(error) {
    console.dir(error);
    res.send({status: false});
  });
};
