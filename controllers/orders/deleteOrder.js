var models = require('../../lib/models');

/**
 * Delete order by id
 * @param {integer} body.orderId
 */
module.exports = function (req, res) {
  models.orders.destroy({
    where: { id: req.body.orderId }
  }).then(function (result) {
    res.send();
  });
};
