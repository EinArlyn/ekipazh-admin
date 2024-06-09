var models = require('../../../lib/models');

/**
 * Get glass prices
 * @param {integer} params.id - Element id
 */
module.exports = function (req, res) {
  var elementId = req.params.id;

  models.glass_prices.findOne({
    where: { element_id: elementId }
  }).then(function (glass_prices) {
    res.send(glass_prices);
  }).catch(function (error) {
    console.log(error);
  });
}
