var models = require('../../../lib/models');

/**
 * Set glass prices
 *
 */
module.exports = function (req, res) {
  var body = {
    element_id: req.params.id,
    col_1_range: req.body.col_1_range,
    col_1_price: req.body.col_1_price,
    col_2_range_1: req.body.col_2_range_1,
    col_2_range_2: req.body.col_2_range_2,
    col_2_price: req.body.col_2_price,
    col_3_range_1: req.body.col_3_range_1,
    col_3_range_2: req.body.col_3_range_2,
    col_3_price: req.body.col_3_price,
    col_4_range_1: req.body.col_4_range_1,
    col_4_range_2: req.body.col_4_range_2,
    col_4_price: req.body.col_4_price,
    col_5_range: req.body.col_5_range,
    col_5_price: req.body.col_5_price,
    table_width: req.body.table_width
  };
  __setGlassPrices(body);

  res.end();
};

/** Helpers
 * [1] - Set glass prices
 */

/**
 * [1] Set glass prices
 * @param {integer} body.element_id - Element Id
 * @param {integer} body.col_[0-5]_range - Range for relevant price
 * @param {numeric} body.col_[0-5]_price - Price for relevant ranges
 * @param {integer} table_width - Table width (trick for easier table building)
 */
function __setGlassPrices(body) {
  models.glass_prices.findOne({
    where: {element_id: body.element_id}
  }).then(function(result) {
    if (result) {
      result.updateAttributes({
        col_1_range: parseFloat(body.col_1_range),
        col_1_price: parseFloat(body.col_1_price),
        col_2_range_1: parseFloat(body.col_2_range_1),
        col_2_range_2: parseFloat(body.col_2_range_2),
        col_2_price: parseFloat(body.col_2_price),
        col_3_range_1: parseFloat(body.col_3_range_1),
        col_3_range_2: parseFloat(body.col_3_range_2),
        col_3_price: parseFloat(body.col_3_price),
        col_4_range_1: parseFloat(body.col_4_range_1),
        col_4_range_2: parseFloat(body.col_4_range_2),
        col_4_price: parseFloat(body.col_4_price),
        col_5_range: parseFloat(body.col_5_range),
        col_5_price: parseFloat(body.col_5_price),
        table_width: parseInt(body.table_width)
      }).then(function() {
        // Done.
      });
    } else {
      models.glass_prices.create({
        element_id: parseInt(body.element_id),
        col_1_range: parseFloat(body.col_1_range),
        col_1_price: parseFloat(body.col_1_price),
        col_2_range_1: parseFloat(body.col_2_range_1),
        col_2_range_2: parseFloat(body.col_2_range_2),
        col_2_price: parseFloat(body.col_2_price),
        col_3_range_1: parseFloat(body.col_3_range_1),
        col_3_range_2: parseFloat(body.col_3_range_2),
        col_3_price: parseFloat(body.col_3_price),
        col_4_range_1: parseFloat(body.col_4_range_1),
        col_4_range_2: parseFloat(body.col_4_range_2),
        col_4_price: parseFloat(body.col_4_price),
        col_5_range: parseFloat(body.col_5_range),
        col_5_price: parseFloat(body.col_5_price),
        table_width: parseInt(body.table_width)
      }).then(function() {
        // Done.
      }).catch(function(err) {
        console.log(err);
      });
    }
  });
}
