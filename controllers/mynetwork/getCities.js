var models = require('../../lib/models');

module.exports = function (req, res) {
  var regionId = req.params.regionId;

  models.cities.findAll({
    where: {
      region_id: parseInt(regionId, 10)
    },
    order: 'name'
  }).then(function(cities) {
    res.send({status: true, cities: cities});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}
