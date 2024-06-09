var models = require('../../../lib/models');

/**
 * Get profile prices
 * @param {integer} params.id - Element id
 */
module.exports = function (req, res) {
  var elementId = req.params.id;

  models.profile_prices.findOne({
    where: { element_id: elementId }
  }).then(function (profile_prices) {
    res.send(profile_prices);
  }).catch(function (error) {
    console.log(error);
  });
}
