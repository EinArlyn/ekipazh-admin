'use strict';

/**
 * Показывает, какой payload уйдёт в Homefash для конкретного заказа.
 * Ничего не отправляет — только собирает и печатает.
 *
 * Запуск: node ./scripts/homefash-payload.js <orderId> [senderId]
 *         npm run homefash:payload -- <orderId> [senderId]
 *
 * senderId — id пользователя, который жмёт кнопку (главный дилер). Без него
 * клиентом в payload окажется автор заказа, и картина будет отличаться от
 * того, что реально уйдёт из админки.
 *
 * JSON идёт в stdout, всё остальное — в stderr, поэтому результат можно
 * сразу положить в файл:
 *         node ./scripts/homefash-payload.js 12345 > payload.json
 */

var orderId = process.argv[2];
var senderId = process.argv[3];

if (!orderId) {
  console.error(
    'Укажите id заказа: node ./scripts/homefash-payload.js <orderId> [senderId]',
  );
  process.exit(1);
}

// Модели подключаем после проверки аргумента, чтобы подсказка не ждала БД
require('dotenv').config();
require('../lib/pg-compat');

var models = require('../lib/models');
require('../lib/relationships');

// Sequelize v3 по умолчанию печатает SQL через console.log, то есть в stdout —
// вместе с payload он попал бы в файл при перенаправлении вывода
models.sequelize.options.logging = false;

var homefash = require('../lib/services/homefash');

function done(code) {
  // Соединение закрываем явно, иначе процесс висит на открытом пуле
  if (models.sequelize && typeof models.sequelize.close === 'function') {
    models.sequelize.close();
  }
  process.exit(code);
}

console.error(
  'Заказ ' +
    orderId +
    ': собираю payload (без отправки)' +
    (senderId ? ', отправитель ' + senderId : '') +
    '...',
);

homefash
  .buildOrderPayload(orderId, { senderId: senderId })
  .then(function (payload) {
    console.log(JSON.stringify(payload, null, 2));
    console.error('Позиций: ' + payload.order[0].orderItems.length);

    var problems = homefash.findProblems(payload);

    if (problems.length) {
      console.error('Отправить нельзя:');
      problems.forEach(function (problem) {
        console.error('  - ' + problem);
      });
    }

    done(problems.length ? 2 : 0);
  })
  .catch(function (err) {
    console.error(
      'Не собрался [' + (err.code || 'unknown') + ']: ' + err.message,
    );
    done(1);
  });
