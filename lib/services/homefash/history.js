'use strict';

var models = require('../../models');

/**
 * История отправок в Homefash.
 *
 * Нужна для двух вещей: ответить «уходил ли этот заказ и чем закончилось» и
 * не дать отправить один заказ дважды — партнёр дубли не отсеивает.
 */

var STATUS = {
  SENT: 'sent',
  DRY_RUN: 'dry_run',
  ERROR: 'error',
};

/**
 * Запись в историю никогда не роняет отправку: если заказ уже ушёл партнёру,
 * упавший INSERT — не повод показывать оператору ошибку.
 *
 * @param {object} entry
 * @returns {Promise}
 */
function record(entry) {
  return models.homefash_sends
    .create({
      order_id: entry.orderId,
      user_id: entry.userId || null,
      status: entry.status,
      http_status: entry.httpStatus || null,
      error: entry.error || null,
      offer_no: entry.offerNo || null,
      items_count: entry.itemsCount === undefined ? null : entry.itemsCount,
      created: new Date(),
    })
    .catch(function (err) {
      console.log('[homefash] история не записана:', err.message);
    });
}

/**
 * Последняя успешная отправка заказа, если она была.
 * @param {number|string} orderId
 * @returns {Promise<object|null>}
 */
function findSuccess(orderId) {
  return models.homefash_sends
    .find({
      where: { order_id: orderId, status: STATUS.SENT },
      order: [['created', 'DESC']],
    })
    .catch(function (err) {
      // Таблицы может ещё не быть (до первого sync) — это не причина
      // блокировать отправку
      console.log('[homefash] история недоступна:', err.message);
      return null;
    });
}

exports.STATUS = STATUS;
exports.record = record;
exports.findSuccess = findSuccess;
