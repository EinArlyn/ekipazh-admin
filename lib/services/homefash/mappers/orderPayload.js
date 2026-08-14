'use strict';

var config = require('../config');
var description = require('./description');

/**
 * Сборка payload для POST /api/orders.
 *
 * ОТКРЫТЫЕ ВОПРОСЫ — согласовать с партнёром, все собраны здесь, чтобы
 * правка была в одном месте:
 *
 *  1. customerInfo.idNo — номер нашего клиента на стороне Homefash. Своей
 *     колонки в users нет, поэтому поле-источник задаётся настройкой
 *     HOMEFASH_CUSTOMER_ID_FIELD (по умолчанию code_kb).
 *  2. articleNo — по примеру ("AN-8759.6.0001") собираем как
 *     "<offerNo>.<customerIdNo>.<позиция, 4 знака>". Середина — догадка.
 *  3. offerPrice / netPrice — цены за штуку. offerPrice это база позиции со
 *     скидками заказа, netPrice — та же база по доле закупочной. Позиционных
 *     закупочных цен в БД нет, поэтому доля общая на весь заказ.
 *  4. Валюта — цены делим на orders.currency_value, считая, что партнёр ждёт
 *     евро. Подтвердить.
 *
 * Поля xml и xmlForCustomer партнёр не читает — документ Warenkorb не
 * формируем.
 */

var UNIT = 'PCE';

/** Ограничение партнёра: артикул не длиннее 18 символов */
var ARTICLE_POSITION_WIDTH = 4;
var ARTICLE_PREFIX_MAX = 18 - ARTICLE_POSITION_WIDTH - 1;

function toNumber(value) {
  var parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

function money(value) {
  return Number(toNumber(value).toFixed(2));
}

function pad(value, width) {
  var result = String(value);

  while (result.length < width) {
    result = '0' + result;
  }

  return result;
}

function formatDate(date) {
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1, 2) +
    '-' +
    pad(date.getDate(), 2)
  );
}

function formatTime(date) {
  return (
    pad(date.getHours(), 2) +
    ':' +
    pad(date.getMinutes(), 2) +
    ':' +
    pad(date.getSeconds(), 2)
  );
}

/** Номер предложения без префикса */
function baseOfferNo(order) {
  return order.order_hz || String(order.order_number || order.id);
}

/**
 * Артикул позиции: у партнёра ограничение в 18 символов и требование
 * различаться между позициями.
 *
 * Номер заказа для этого короче и надёжнее, чем order_hz (тот бывает вида
 * "--26/226-121542" и вместе с позицией уже не влезает).
 */
function articlePrefix(order) {
  var base = String(order.order_number || order.id || '').replace(
    /[^0-9A-Za-z_-]/g,
    '',
  );

  // Хвост информативнее начала: у длинных id различаются младшие разряды
  return base.slice(-ARTICLE_PREFIX_MAX);
}

function buildArticleNo(prefix, position) {
  return prefix + '.' + pad(position, ARTICLE_POSITION_WIDTH);
}

/**
 * Комиссия: чей заказ и для кого — в формате примера партнёра
 * ("Wieczorek BV: Räther, Sarenseck").
 */
function buildCommission(order, author) {
  var customer = [order.customer_name, order.customer_city]
    .filter(Boolean)
    .join(', ');
  var dealer = author ? author.legal_name || author.name : null;

  return [dealer, customer].filter(Boolean).join(': ');
}

/**
 * Незаполненный номер контрагента в БД выглядит по-разному: null, пустая
 * строка, строковый "0". Для партнёра всё это — отсутствие номера.
 */
function isBlankIdNo(value) {
  if (value === null || value === undefined) {
    return true;
  }

  var text = String(value).trim();

  // Нечисловые номера (например "SPA39") считаем заполненными — пустым
  // считается только пусто и ноль в любом написании
  return text === '' || /^0+$/.test(text);
}

function buildCustomer(user, country) {
  var idNo = user[config.customerIdField];

  // Пока в БД номера нет, для тестов его подставляет настройка
  if (isBlankIdNo(idNo)) {
    idNo = config.fallbackCustomerId;
  }

  return {
    // Номер приводим к числу: в примере партнёра IDNo числовой
    idNo: isBlankIdNo(idNo) ? null : toNumber(idNo) || idNo,
    address: {
      name1: user.legal_name || user.name,
      name2:
        user.legal_name && user.name !== user.legal_name ? user.name : null,
      street: user.address || null,
      zip: null, // в users индекса нет
      city: user.city ? user.city.name : null,
      // Страна приходит из цепочки город → регион → страна; настройка
      // остаётся запасным вариантом, если цепочка оборвана
      country: country || config.defaultCountry,
    },
  };
}

function buildSupplier() {
  return {
    idNo: config.supplier.idNo,
    address: { name1: config.supplier.name1 },
  };
}

/**
 * Курс, в который сложены цены заказа.
 *
 * order_products.product_price хранится в валюте расчёта (для испанских
 * заказов это гривна с курсом в orders.currency_value), а партнёру нужны
 * евро — то же деление делает и PDF заказа.
 */
function currencyRate(order) {
  if (!config.convertCurrency) {
    return 1;
  }

  var rate = toNumber(order.currency_value);

  return rate > 0 ? rate : 1;
}

/**
 * Доля закупочной цены в базовой: order_products.product_price — это база
 * без скидок (их сумма равна order_prices.base_price), а закупочная известна
 * только суммой по заказу.
 */
function netRatio(price) {
  var purchase = price ? toNumber(price.purchase_price) : 0;
  var base = price ? toNumber(price.base_price) : 0;

  return purchase > 0 && base > 0 ? purchase / base : 1;
}

/**
 * Скидки заказа. Конструкции и доп. элементы дисконтируются раздельно и
 * разными процентами — точно так же их разводит КП (PDFKit).
 */
function discountFactors(order, price) {
  function factor(value, fallback) {
    var percent = toNumber(
      value === null || value === undefined ? fallback : value,
    );

    return percent > 0 && percent < 100 ? 1 - percent / 100 : 1;
  }

  var row = price || {};

  return {
    construct: factor(row.discount_construct, order.discount_construct),
    addelem: factor(row.discount_addelem, order.discount_addelem),
  };
}

/**
 * Множитель, убирающий НДС из offerPrice.
 *
 * Партнёр начисляет Umsatzsteuer сам, поверх присланных сумм, поэтому цена
 * предложения должна уходить без налога — иначе он посчитается дважды.
 * netPrice в этом не нуждается: в БД она уже без НДС.
 */
function offerVatFactor() {
  var rate = toNumber(config.offerVatRate);

  return rate > 0 && rate < 100 ? 1 - rate / 100 : 1;
}

/**
 * Цены позиции.
 *
 * offerPrice — то, что видит клиент в предложении: база со скидками заказа,
 * за вычетом НДС. netPrice — наша закупочная у завода, она же цена в КП.
 */
function resolvePrices(product, context) {
  var constructions = toNumber(product.template_price);
  var additions = toNumber(product.addelem_price);
  var base = toNumber(product.product_price);
  var offer;

  if (constructions || additions) {
    offer =
      constructions * context.discounts.construct +
      additions * context.discounts.addelem;
  } else {
    // У позиций без разбивки (например ролет) скидывать нечего
    offer = base;
  }

  return {
    offerPrice: money((offer / context.rate) * context.offerVat),
    netPrice: money((base * context.netRatio) / context.rate),
  };
}

function buildItems(context) {
  var order = context.order;
  var dictionaries = context.dictionaries;
  var prefix = articlePrefix(order);
  var priceContext = {
    rate: currencyRate(order),
    netRatio: netRatio(context.price),
    discounts: discountFactors(order, context.price),
    offerVat: offerVatFactor(),
  };

  return (order.order_products || [])
    .filter(function (product) {
      // is_addelem_only === 1 — не конструкция, а доп. элемент; в PDF такие
      // позиции тоже показываются отдельно
      return product.is_addelem_only !== 1;
    })
    .map(function (product, index) {
      var position = index + 1;
      var prices = resolvePrices(product, priceContext);

      return {
        position: position,
        articleNo: buildArticleNo(prefix, position),
        quantity: parseInt(product.product_qty, 10) || 0,
        unit: UNIT,
        description: description.buildShort(product),
        descriptionLong: description.buildLong(order, dictionaries, product),
        offerPrice: prices.offerPrice,
        netPrice: prices.netPrice,
      };
    });
}

/**
 * Замечания, из-за которых заказ нельзя отправлять: партнёр на неполные
 * данные ответит невнятно, а оператору нужна конкретная причина.
 *
 * Сборку они не прерывают — payload полезно посмотреть и неполным, этим
 * занимается scripts/homefash-payload.js. Проверку делает отправка.
 */
function findProblems(payload) {
  var problems = [];

  if (isBlankIdNo(payload.customerInfo.idNo)) {
    problems.push(
      'у пользователя не заполнено поле ' +
        config.customerIdField +
        ' (номер клиента в Homefash) и не задан HOMEFASH_FALLBACK_CUSTOMER_ID',
    );
  }

  if (isBlankIdNo(payload.order[0].supplierInfo.idNo)) {
    problems.push('не задан HOMEFASH_SUPPLIER_ID');
  }

  if (!payload.order[0].orderItems.length) {
    problems.push('в заказе нет конструкций');
  }

  return problems;
}

/**
 * @param {object} data                   — результат loaders/order.js
 * @param {object} [options]
 * @param {Date}   [options.now]          — точка времени документа (для тестов)
 * @param {object} [options.dictionaries] — готовые справочники вместо запроса в БД
 * @returns {Promise<object>} payload для POST /api/orders
 */
function build(data, options) {
  var opts = options || {};
  var order = data.order;
  var now = opts.now || new Date();
  var dictionariesPromise = opts.dictionaries
    ? Promise.resolve(opts.dictionaries)
    : description.loadDictionaries(order, order.factory_id);

  return dictionariesPromise.then(function (dictionaries) {
    // Клиент для партнёра — тот, кто отправляет заказ (главный дилер), а не
    // автор заказа: покупает у нас именно он. Автор — его дилер, он уходит
    // в комиссию, как в примере партнёра
    var customer = buildCustomer(data.sender || data.user, data.country);
    var supplier = buildSupplier();
    var items = buildItems({
      order: order,
      price: data.price,
      dictionaries: dictionaries,
      customer: customer,
    });

    var orderInfo = {
      offerNo: config.offerPrefix + baseOfferNo(order),
      commission: buildCommission(order, data.user),
    };

    var payload = {
      date: formatDate(now),
      time: formatTime(now),
      orderInfo: orderInfo,
      customerInfo: customer,
      order: [
        {
          supplierInfo: supplier,
          orderItems: items,
        },
      ],
    };

    return payload;
  });
}

exports.build = build;
exports.findProblems = findProblems;
