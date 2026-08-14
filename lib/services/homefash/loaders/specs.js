'use strict';

var models = require('../../../models');

/**
 * Справочные данные для характеристик позиций: камеры и теплопроводность
 * профиля, параметры стеклопакетов.
 *
 * Те же источники использует КП (PDFKit), но там они грузятся целыми
 * таблицами через findAll({}) — здесь спрашиваем только то, что встретилось
 * в заказе.
 */

function collectIds(order) {
  var products = order.order_products || [];
  var ids = { profiles: [], doorsGroups: [], glasses: [] };

  products.forEach(function (product) {
    if (product.profile_id) {
      ids.profiles.push(product.profile_id);
    }

    if (product.door_group_id) {
      ids.doorsGroups.push(product.door_group_id);
    }

    String(product.glass_id || '')
      .split(',')
      .map(function (value) {
        return parseInt(value, 10);
      })
      .filter(Boolean)
      .forEach(function (id) {
        ids.glasses.push(id);
      });
  });

  Object.keys(ids).forEach(function (key) {
    ids[key] = ids[key].filter(function (id, index, all) {
      return all.indexOf(id) === index;
    });
  });

  return ids;
}

function indexById(rows, build) {
  return rows.reduce(function (acc, row) {
    acc[row.id] = build(row);
    return acc;
  }, {});
}

function findAll(model, ids, attributes) {
  if (!ids.length) {
    return Promise.resolve([]);
  }

  return model.findAll({ where: { id: { $in: ids } }, attributes: attributes });
}

/**
 * @param {object} order — заказ с order_products
 * @returns {Promise<{profiles, doorsGroups, glasses}>}
 */
module.exports = function loadSpecs(order) {
  var ids = collectIds(order);

  return Promise.all([
    findAll(models.profile_systems, ids.profiles, [
      'id',
      'cameras',
      'heat_coeff_value',
    ]),
    findAll(models.doors_groups, ids.doorsGroups, [
      'id',
      'cameras',
      'heat_coeff_value',
    ]),
    findAll(models.lists, ids.glasses, ['id', 'parent_element_id']),
  ])
    .then(function (results) {
      var glassLists = results[2];
      var elementIds = glassLists
        .map(function (list) {
          return list.parent_element_id;
        })
        .filter(Boolean);

      return Promise.all([
        findAll(models.elements, elementIds, [
          'id',
          'glass_width',
          'transcalency',
          'noise_coeff',
        ]),
        elementIds.length
          ? models.glasses_folders.findAll({
              where: { element_id: { $in: elementIds } },
            })
          : [],
      ]).then(function (glassData) {
        var elements = indexById(glassData[0], function (element) {
          return element;
        });

        return {
          profiles: indexById(results[0], toProfile),
          doorsGroups: indexById(results[1], toProfile),
          glasses: buildGlasses(glassLists, elements, glassData[1]),
        };
      });
    })
    .catch(function (err) {
      // Без характеристик позиция уйдёт с коротким описанием — это лучше,
      // чем не уйти вовсе
      console.log('[homefash] характеристики не загрузились:', err.message);
      return { profiles: {}, doorsGroups: {}, glasses: {} };
    });
};

function toProfile(row) {
  var heat = parseFloat(row.heat_coeff_value);

  return {
    cameras: row.cameras || null,
    // В КП показывают обратную величину
    heatCoeff: heat > 0 ? 1 / heat : null,
  };
}

function buildGlasses(glassLists, elements, folderLinks) {
  return glassLists.reduce(function (acc, list) {
    var element = elements[list.parent_element_id];

    acc[list.id] = {
      width: element ? element.glass_width : null,
      noise: element ? element.noise_coeff : null,
      // transcalency — сопротивление, в КП печатают обратную величину
      heatCoeff:
        element && parseFloat(element.transcalency) > 0
          ? 1 / parseFloat(element.transcalency)
          : null,
      folderIds: folderLinks
        .filter(function (link) {
          return link.element_id === list.parent_element_id;
        })
        .map(function (link) {
          return link.glass_folders_id;
        }),
    };

    return acc;
  }, {});
}
