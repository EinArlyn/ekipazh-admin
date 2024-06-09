var models = require('../../lib/models');

/**
 * Get order report by id
 * @param {integer} params.id - Order id
 * @param {integer} query.type - Elements type
 */
module.exports = function (req, res) {
  var orderId = req.params.id;
  var type = req.query.type.split(', ');

  models.order_elements.findAll({
    where: {
      order_id: orderId
    },
    include: [{
      model: models.elements,
      where: {
        element_group_id: {
          $in: type
        }
      }
    }]
  }).then(function (elements) {
    res.send({ status: true, elements: elements });
  }).catch(function (err) {
    res.send({ status: false });
  });
}
