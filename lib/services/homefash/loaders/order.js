'use strict';

var models = require('../../../models');
var HomefashApiError = require('../errors');

/**
 * Загрузка заказа со всем, что нужно для payload.
 *
 * Дерево include повторяет controllers/orders/getOrder.js — специально,
 * чтобы отправка в Homefash видела ровно те же данные, что и карточка
 * заказа с PDF.
 *
 * @param {number|string} orderId
 * @param {object} [options]
 * @param {number} [options.senderId] — кто отправляет заказ (главный дилер)
 * @returns {Promise<{order, user, sender, price, country}>}
 */
module.exports = function loadOrder(orderId, options) {
  var opts = options || {};

  return models.orders
    .find({
      where: { id: orderId },
      include: [
        {
          model: models.order_products,
          include: [
            {
              model: models.profile_systems,
              attributes: ['id', 'name'],
              required: false,
            },
            {
              model: models.window_hardware_groups,
              attributes: ['id', 'name'],
              required: false,
            },
            {
              model: models.doors_groups,
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
        { model: models.order_addelements },
      ],
    })
    .then(function (order) {
      if (!order) {
        throw new HomefashApiError('Заказ ' + orderId + ' не найден', {
          code: 'validation',
        });
      }

      // Порядок позиций должен быть стабильным между отправками: номер позиции
      // попадает в articleNo, и перестановка сломала бы сверку у партнёра.
      order.order_products = (order.order_products || []).sort(function (a, b) {
        return a.product_id - b.product_id;
      });

      return attachDoorsHardware(order)
        .then(function () {
          return models.users.find({
            where: { id: order.user_id },
            include: [{ model: models.cities }],
          });
        })
        .then(function (user) {
          if (!user) {
            throw new HomefashApiError(
              'У заказа ' + orderId + ' не найден пользователь',
              { code: 'validation' },
            );
          }

          return loadSender(opts.senderId, user).then(function (sender) {
            return Promise.all([
              models.order_prices.find({
                where: { order_id: orderId, user_id: order.user_id },
              }),
              // Страна нужна для того, кто попадёт в customerInfo
              loadCountry(sender),
            ]).then(function (results) {
              return {
                order: order,
                user: user,
                sender: sender,
                price: results[0] || null,
                country: results[1],
              };
            });
          });
        });
    });
};

/**
 * У дверей hardware_id указывает не на window_hardware_groups, а на
 * doors_hardware_groups — join по ассоциации подставил бы чужую группу с тем
 * же id. Ту же подмену делает controllers/orders/getOrderPDF.js.
 */
function attachDoorsHardware(order) {
  var doors = (order.order_products || []).filter(function (product) {
    return product.door_group_id && product.hardware_id;
  });

  if (!doors.length) {
    return Promise.resolve();
  }

  var ids = doors.map(function (product) {
    return product.hardware_id;
  });

  return models.doors_hardware_groups
    .findAll({ where: { id: { $in: ids } }, attributes: ['id', 'name'] })
    .then(function (groups) {
      var byId = {};

      groups.forEach(function (group) {
        byId[group.id] = group;
      });

      doors.forEach(function (product) {
        product.doors_hardware_group = byId[product.hardware_id] || null;
      });
    })
    .catch(function (err) {
      console.log(
        '[homefash] группы дверной фурнитуры не загрузились:',
        err.message,
      );
    });
}

/**
 * Отправитель заказа — главный дилер, который жмёт кнопку. Сессионного
 * пользователя перезагружаем из БД: в сессии нет города, а он нужен для
 * адреса клиента.
 */
function loadSender(senderId, author) {
  if (!senderId || String(senderId) === String(author.id)) {
    return Promise.resolve(author);
  }

  return models.users
    .find({ where: { id: senderId }, include: [{ model: models.cities }] })
    .then(function (sender) {
      return sender || author;
    })
    .catch(function (err) {
      console.log('[homefash] отправитель не загрузился:', err.message);
      return author;
    });
}

/**
 * Страна клиента: в users её нет, поднимаемся по цепочке
 * город → регион → страна.
 */
function loadCountry(user) {
  if (!user.city || !user.city.region_id) {
    return Promise.resolve(null);
  }

  return models.regions
    .find({
      where: { id: user.city.region_id },
      attributes: ['id', 'country_id'],
    })
    .then(function (region) {
      if (!region || !region.country_id) {
        return null;
      }

      return models.countries
        .find({ where: { id: region.country_id }, attributes: ['id', 'name'] })
        .then(function (country) {
          if (!country) {
            return null;
          }

          // В countries названия английские ("Germany"). Немецкое подхватится
          // само, если завести строку в locales_names — тем же способом, каким
          // переведены системы и группы. Записей для стран пока нет.
          return models.locales_names
            .find({
              where: {
                table_name: 'countries',
                table_id: country.id,
                table_attr: 'name',
              },
            })
            .then(function (translation) {
              return (translation && translation.de) || country.name;
            })
            .catch(function () {
              return country.name;
            });
        });
    })
    .catch(function (err) {
      console.log('[homefash] страна клиента не определилась:', err.message);
      return null;
    });
}
