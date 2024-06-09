var models = require('../../lib/models');

/**
 * Update order counter
 */
module.exports = function (req, res) {
  return res.send({ status: false });
  // models.order_prices.findAndCountAll({
  //   where: { user_id: req.session.user.id },
  //   attributes: ['id']
  // }).then(function (result) {
  //   res.send({ status: true, count: result.count });
  // });
};
