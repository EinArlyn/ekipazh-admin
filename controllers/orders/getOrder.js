var models = require('../../lib/models');
var parseOrder = require('../../lib/services/PDFKit').parseOrder;
var validateExportFolder = require('../../lib/services/orders').validateExportFolder;

/**
 * Get order by id
 * @param {numeric} - Order Id
 */
module.exports = function (req, res) {
  var orderId = req.params.id;

  models.order_prices.find({
    where: {
      order_id: orderId,
      user_id: req.session.user.id
    },
    include: [{
      model: models.orders,
      include: [{
        model: models.order_products,
        include: [{
          model: models.profile_systems,
          attributes: ['id', 'name'],
          required: false
        }, {
          model: models.window_hardware_groups,
          attributes: ['id', 'name'],
          required: false
        }, {
          model: models.doors_groups,
          attributes: ['id', 'name'],
          required: false
        }]
      }, {
        model: models.order_addelements
      }]
    }, {
      model: models.users,
      include: {
        model: models.cities
      }
    }]
  }).then(function (order) {
    parseOrder(order.dataValues.order, req.session.user.factory_id, function (result) {
      order.res = result;
      validateExportFolder(order.order.order_hz, function (err, links) {
        res.send({
          status: true,
          ACC_PRICE_LINK: links.ACC_PRICE_LINK,
          SPEC_LINK: links.SPEC_LINK,
          order: order,
          parsedOrder: result,
          user: {
            code_kb: req.session.user.code_kb
          }
        });
      });
    });
  }).catch(function (err) {
    console.log(err);
    res.send({status: false});
  });
}
