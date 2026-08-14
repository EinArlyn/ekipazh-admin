'use strict';

var config = require('./config');
var access = require('./access');
var history = require('./history');
var loadOrder = require('./loaders/order');
var orderPayload = require('./mappers/orderPayload');
var ordersResource = require('./resources/orders');
var HomefashApiError = require('./errors');

/**
 * Интеграция с Homefash IDS API.
 *
 * Два входа сделаны намеренно:
 *   - sendOrder(orderId) — рабочий сценарий, всё внутри;
 *   - sendOrderPayload(payload) — отправка готового payload, без БД.
 * Второй нужен, чтобы транспорт можно было проверить отдельно от выборки
 * заказа и чтобы им мог воспользоваться другой источник данных.
 */

/**
 * Собрать payload без отправки — для отладки и сверки с партнёром.
 * @param {number|string} orderId
 * @param {object} [options]
 * @returns {Promise<object>}
 */
function buildOrderPayload(orderId, options) {
  var opts = options || {};

  return loadOrder(orderId, {
    senderId: opts.user ? opts.user.id : opts.senderId,
  }).then(function (data) {
    return orderPayload.build(data, opts);
  });
}

/**
 * Замечания к payload, из-за которых его нельзя отправлять.
 * @param {object} payload
 * @returns {string[]}
 */
function findProblems(payload) {
  return orderPayload.findProblems(payload);
}

/**
 * Отправить готовый payload.
 * @param {object} payload
 * @param {object} [options] — { dryRun, headers }
 * @returns {Promise<{dryRun: boolean, status: number|null, response: *, payload: object}>}
 */
function sendOrderPayload(payload, options) {
  return ordersResource.create(payload, options).then(function (result) {
    return {
      dryRun: result.dryRun,
      status: result.status,
      response: result.body,
      payload: payload,
    };
  });
}

function formatDateTime(date) {
  return new Date(date).toLocaleString('ru-RU');
}

/**
 * Собрать заказ из БД и отправить.
 *
 * Каждая попытка попадает в историю, а повторная отправка уже ушедшего
 * заказа блокируется: партнёр дубли не отсеивает.
 *
 * @param {number|string} orderId
 * @param {object} [options] — { dryRun, now, headers, user, force }
 * @returns {Promise<{dryRun: boolean, status: number|null, response: *, payload: object}>}
 */
function sendOrder(orderId, options) {
  var opts = options || {};
  var userId = opts.user ? opts.user.id : null;

  return checkNotSentYet(orderId, opts)
    .then(function () {
      return buildOrderPayload(orderId, opts);
    })
    .then(function (payload) {
      var problems = findProblems(payload);

      if (problems.length) {
        throw new HomefashApiError(
          'Заказ ' + orderId + ' нельзя отправить: ' + problems.join('; '),
          { code: 'validation' },
        );
      }

      return sendOrderPayload(payload, opts).then(function (result) {
        return history
          .record({
            orderId: orderId,
            userId: userId,
            status: result.dryRun
              ? history.STATUS.DRY_RUN
              : history.STATUS.SENT,
            httpStatus: result.status,
            offerNo: payload.orderInfo.offerNo,
            itemsCount: payload.order[0].orderItems.length,
          })
          .then(function () {
            return result;
          });
      });
    })
    .catch(function (err) {
      // Отказ по дублю уже описан в истории — второй записи не нужно
      if (err.code === 'duplicate') {
        throw err;
      }

      return history
        .record({
          orderId: orderId,
          userId: userId,
          status: history.STATUS.ERROR,
          error: err.message,
          httpStatus: err.status,
        })
        .then(function () {
          throw err;
        });
    });
}

/**
 * @returns {Promise} отклоняется, если заказ уже уходил партнёру
 */
function checkNotSentYet(orderId, opts) {
  if (opts.force) {
    return Promise.resolve();
  }

  return history.findSuccess(orderId).then(function (sent) {
    if (sent) {
      throw new HomefashApiError(
        'Заказ ' + orderId + ' уже отправлен ' + formatDateTime(sent.created),
        // Дату отдаём отдельно: интерфейс предлагает по ней переотправку
        { code: 'duplicate', body: { sentAt: sent.created } },
      );
    }
  });
}

exports.buildOrderPayload = buildOrderPayload;
exports.findProblems = findProblems;
exports.sendOrderPayload = sendOrderPayload;
exports.sendOrder = sendOrder;
exports.isAllowedUser = access.isAllowedUser;
exports.history = history;
exports.config = config;
exports.HomefashApiError = HomefashApiError;
