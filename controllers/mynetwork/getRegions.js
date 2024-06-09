var models = require('../../lib/models');

module.exports = function (req, res) {
  var countryId = req.params.countryId;

  models.regions.findAll({
    where: {
      country_id: parseInt(countryId, 10)
    },
    order: 'name'
  }).then(function(regions) {
    res.send({status: true, regions: regions});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}
