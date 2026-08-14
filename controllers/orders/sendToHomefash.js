var homefash = require('../../lib/services/homefash');

/**
 * Отправка заказа в Homefash IDS API
 * @param {numeric} params.id     - Order id
 * @param {boolean} body.force    - Переотправить заказ, уже ушедший партнёру
 */
module.exports = function (req, res) {
  var orderId = req.params.id;
  var force = req.body.force === true || req.body.force === 'true';

  homefash
    .sendOrder(orderId, { user: req.session.user, force: force })
    .then(function (result) {
      console.log(
        '[homefash] заказ ' +
          orderId +
          (result.dryRun ? ' собран (dry run)' : ' отправлен') +
          (force ? ' (повторно)' : ''),
      );

      res.send({
        status: true,
        dryRun: result.dryRun,
        httpStatus: result.status,
      });
    })
    .catch(function (err) {
      console.log(
        '[homefash] заказ ' + orderId + ' не отправлен:',
        err.message,
      );

      res.send({
        status: false,
        code: err.code || 'unknown',
        error: err.message,
        // По дате отправки интерфейс предложит переотправку
        sentAt: (err.body && err.body.sentAt) || null,
      });
    });
};
