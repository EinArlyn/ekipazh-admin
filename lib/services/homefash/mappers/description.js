'use strict';

// Синглтон i18n должен быть настроен до первого вызова parseOrder: он
// переводит названия (например «Белый» для ламинации) и без configure()
// падает внутри промиса, молча оставляя справочники пустыми
require('../../../i18n');

var models = require('../../../models');
var parseOrder = require('../../PDFKit').parseOrder;
var loadSpecs = require('../loaders/specs');

/** Язык обмена с партнёром: колонка в locales_names */
var LOCALE = 'de';

/**
 * Тексты позиции для Homefash: Kurztext (description) и Langtext
 * (descriptionLong).
 *
 * Подписи зашиты по-немецки и не идут через i18n: это формат обмена с
 * немецким партнёром, а не интерфейс — он не должен менять вид от того,
 * на каком языке сейчас админка.
 *
 * Состав descriptionLong повторяет блок позиции в коммерческом предложении:
 * профиль с камерами и теплопроводностью, цвет снаружи/внутри, стеклопакет
 * с параметрами, фурнитура с ручкой, габариты, площадь, периметр, вес и
 * доп. элементы. Цены сюда не входят — они уходят отдельными полями.
 */

var LABELS = {
  system: 'Profilsystem',
  frameType: 'Rahmentyp',
  chambers: 'Anzahl der Kammern',
  // В КП здесь стоит непереведённый ключ "Thermal_conductivity" — партнёру
  // отдаём принятые в отрасли обозначения: Uf для рамы, Ug для стеклопакета
  frameThermal: 'Uf',
  glazingThermal: 'Ug',
  thermalUnit: 'W/m²K',
  profileColor: 'Profilfarbe',
  outside: 'außen',
  inside: 'innen',
  glazingUnit: 'Isolierglas',
  glazingWidth: 'Breite',
  noise: 'Schalldämmung (dB)',
  glazingType: 'Verglasungstyp',
  handleHeight: 'Griffhöhe',
  handleHeightCenter: 'Mitte',
  decorColor: 'Dekorfarbe',
  size: 'Größe',
  perimeter: 'Umfang (m)',
  weight: 'Gewicht (kg)',
  decor: 'Dekor',
  glazing: 'Verglasung',
  hardware: 'Beschlag',
  area: 'Fläche',
  accessories: 'Zubehör',
  box: 'Rollladenkasten',
  armour: 'Panzer',
  guide: 'Führung',
  endList: 'Endleiste',
  control: 'Bedienung',
  color: 'Farbe',
};

/** is_addelem_only === 2 — ролета, у неё своя структура данных */
var ROLET = 2;

function toNumber(value) {
  var parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Справочники названий (ламинации, стёкла, доп. элементы) через тот же
 * parseOrder, что готовит данные для PDF — чтобы названия в спецификации
 * и в заказе для партнёра не разъезжались.
 */
function loadDictionaries(order, factoryId) {
  return Promise.all([
    loadOrderDictionaries(order, factoryId),
    loadLocaleNames(factoryId),
    loadSpecs(order),
  ]).then(function (results) {
    var dictionaries = results[0];

    dictionaries.names = results[1];
    dictionaries.specs = results[2];

    return dictionaries;
  });
}

function loadOrderDictionaries(order, factoryId) {
  return new Promise(function (resolve) {
    var empty = {
      hardwares: [],
      laminations: [],
      addElements: [],
      glasses: [],
    };

    try {
      parseOrder(
        order,
        factoryId,
        function (result) {
          resolve(result || empty);
        },
        LOCALE,
      );
    } catch (err) {
      // Названия — не повод ронять отправку: без них позиция уйдёт с
      // сокращённым описанием, а причина останется в логе.
      console.log('[homefash] справочники не загрузились:', err.message);
      resolve(empty);
    }
  });
}

/**
 * Немецкие названия систем, групп и элементов.
 *
 * В самих таблицах названия хранятся на языке завода (украинском), а переводы
 * лежат в locales_names — оттуда же их берёт PDF коммерческого предложения.
 * Заполнены они не везде, поэтому всегда нужен запасной вариант.
 */
function loadLocaleNames(factoryId) {
  return models.locales_names
    .findAll({ where: { factory_id: factoryId, table_attr: 'name' } })
    .then(function (rows) {
      var byTable = {};

      rows.forEach(function (row) {
        var translated = row[LOCALE];

        if (!translated) {
          return;
        }

        if (!byTable[row.table_name]) {
          byTable[row.table_name] = {};
        }

        byTable[row.table_name][row.table_id] = translated;
      });

      return byTable;
    })
    .catch(function (err) {
      console.log('[homefash] переводы названий не загрузились:', err.message);
      return {};
    });
}

/** Немецкое название записи или исходное, если перевода нет */
function translate(dictionaries, table, id, fallback) {
  var names = (dictionaries.names || {})[table];
  var translated = names && id !== null && id !== undefined ? names[id] : null;

  return translated || fallback || null;
}

function laminationName(dictionaries, laminationTypeId) {
  var id = parseInt(laminationTypeId, 10);

  if (!id) {
    return null;
  }

  var found = (dictionaries.laminations || []).filter(function (lamination) {
    return parseInt(lamination.lamination_type_id, 10) === id;
  })[0];

  if (!found) {
    return null;
  }

  return translate(
    dictionaries,
    'lamination_factory_colors',
    found.id,
    found.name,
  );
}

/**
 * Профильная система: у дверей её роль играет группа дверей — так же, как в
 * PDF коммерческого предложения.
 */
function systemName(dictionaries, product) {
  if (product.profile_system && product.profile_system.name) {
    return translate(
      dictionaries,
      'profile_systems',
      product.profile_system.id,
      product.profile_system.name,
    );
  }

  if (product.doors_group && product.doors_group.name) {
    return translate(
      dictionaries,
      'doors_groups',
      product.doors_group.id,
      product.doors_group.name,
    );
  }

  return null;
}

/** Фурнитура: у дверей она из своей таблицы, её подставляет загрузчик */
function hardwareName(dictionaries, product) {
  if (product.door_group_id) {
    var doorsHardware = product.doors_hardware_group;

    return translate(
      dictionaries,
      'doors_hardware_groups',
      product.hardware_id,
      doorsHardware && doorsHardware.name,
    );
  }

  if (product.window_hardware_group && product.window_hardware_group.name) {
    return translate(
      dictionaries,
      'window_hardware_groups',
      product.window_hardware_group.id,
      product.window_hardware_group.name,
    );
  }

  return null;
}

/**
 * Москитные сетки лежат не в lists, а в своих таблицах — искать их перевод
 * среди списков бесполезно (так же их разделяет parseOrder по element_type).
 */
function accessoryTables(addElement) {
  return addElement.element_type === 0
    ? ['mosquitos', 'mosquitos_singles']
    : ['lists'];
}

function accessoryNames(order, dictionaries, product) {
  return (order.order_addelements || [])
    .filter(function (addElement) {
      return addElement.product_id === product.product_id;
    })
    .map(function (addElement) {
      var known = dictionaries.addElements[addElement.element_id];
      var name = accessoryTables(addElement).reduce(function (found, table) {
        return (
          found || translate(dictionaries, table, addElement.element_id, null)
        );
      }, null);

      name = name || (known && known.name) || addElement.name;

      if (!name) {
        return null;
      }

      if (addElement.element_width && addElement.element_height) {
        return (
          name +
          ' ' +
          addElement.element_width +
          '*' +
          addElement.element_height +
          'mm'
        );
      }

      return name;
    })
    .filter(Boolean);
}

/**
 * У ролет размеры и комплектация лежат не в колонках order_products, а в
 * JSON внутри template_source — колонки template_width/height у них нулевые.
 */
function roletSource(product) {
  return product.is_addelem_only === ROLET ? templateSource(product) : null;
}

/**
 * Конфигурация конструкции: блоки со створками и ручками, вес, шпросы.
 * Хранится JSON-строкой в колонке template_source.
 */
function templateSource(product) {
  if (!product.template_source) {
    return null;
  }

  try {
    return typeof product.template_source === 'string'
      ? JSON.parse(product.template_source)
      : product.template_source;
  } catch (err) {
    console.log(
      '[homefash] template_source позиции ' + product.product_id + ':',
      err.message,
    );
    return null;
  }
}

function sizeText(width, height) {
  return (
    Math.round(toNumber(width)) + '*' + Math.round(toNumber(height)) + 'mm'
  );
}

/** Kurztext: тип и габариты конструкции */
function buildShort(product) {
  var rolet = roletSource(product);

  if (rolet) {
    var sizes = rolet.roletSizes || {};
    return 'Rollladen BxH: ' + sizeText(sizes.width_total, sizes.height_total);
  }

  return (
    'Element BxH: ' + sizeText(product.template_width, product.template_height)
  );
}

/** Langtext ролеты: короб, полотно, направляющие, управление */
function buildRoletLong(rolet) {
  var parts = [];

  function add(label, value) {
    if (value) {
      parts.push(label + ': ' + String(value).trim());
    }
  }

  var box = rolet.box || {};
  var group = rolet.group || {};

  add(LABELS.box, group.name ? box.name + ' (' + group.name + ')' : box.name);
  add(LABELS.armour, (rolet.lamel || {}).name);
  add(LABELS.guide, (rolet.guide || {}).name);
  add(LABELS.endList, (rolet.endList || {}).name);
  add(LABELS.control, (rolet.control || {}).name);
  add(LABELS.color, (box.color_front || {}).name);

  if (rolet.square) {
    add(LABELS.area, toNumber(rolet.square).toFixed(2) + ' m2');
  }

  return parts.join(', ');
}

/**
 * Тип рамы двери — формулировки те же, что в немецкой локали КП.
 * construction_type === 4 — дверь.
 */
var FRAME_TYPES = {
  0: 'Rahmenumfang',
  1: 'Rahmen ohne Schwelle',
  2: 'Rahmen mit Aluminiumschwelle',
  3: 'Rahmen mit Aluminiumschwelle',
};

function frameType(product) {
  if (product.construction_type !== 4) {
    return null;
  }

  return FRAME_TYPES[product.door_type_index] || null;
}

/** Характеристики профиля: камеры и теплопроводность */
function profileSpec(dictionaries, product) {
  var specs = dictionaries.specs || {};
  var found = product.door_group_id
    ? (specs.doorsGroups || {})[product.door_group_id]
    : (specs.profiles || {})[product.profile_id];

  return found || {};
}

/** Стеклопакет: ширина, шумоизоляция, теплопроводность, тип */
function glazingSpec(dictionaries, product) {
  var specs = (dictionaries.specs || {}).glasses || {};

  return String(product.glass_id || '')
    .split(',')
    .map(function (rawId) {
      var id = parseInt(rawId, 10);
      var name = translate(dictionaries, 'lists', id, dictionaries.glasses[id]);
      var spec = specs[id];

      if (!name) {
        return null;
      }

      if (!spec) {
        return name;
      }

      var details = [];

      if (spec.width) {
        details.push(LABELS.glazingWidth + ' ' + spec.width + 'mm');
      }

      if (spec.noise) {
        details.push(LABELS.noise + ': ' + toNumber(spec.noise).toFixed(2));
      }

      if (spec.heatCoeff) {
        details.push(
          LABELS.glazingThermal +
            ': ' +
            spec.heatCoeff.toFixed(2) +
            ' ' +
            LABELS.thermalUnit,
        );
      }

      var folders = (spec.folderIds || [])
        .map(function (folderId) {
          return translate(dictionaries, 'glass_folders', folderId, null);
        })
        .filter(Boolean);

      if (folders.length) {
        details.push(LABELS.glazingType + ': ' + folders.join(' / '));
      }

      return details.length ? name + ' (' + details.join(' / ') + ')' : name;
    })
    .filter(Boolean);
}

/**
 * Ручка, высота ручки и цвет декора — всё это лежит в template_source,
 * в блоках конструкции.
 */
function handleSpec(dictionaries, product) {
  var template = templateSource(product);
  var blocks = (template && template.details) || [];
  var result = { handle: null, height: null, decor: null };

  blocks.forEach(function (block) {
    if (block.blockType === 'sash' && block.heightHandle > 0) {
      result.height = block.heightHandle + 'mm';
    }

    if (block.blockType === 'sash' && block.heightHandle === 0) {
      result.height = LABELS.handleHeightCenter;
    }

    if (block.newHandle) {
      result.handle = translate(dictionaries, 'lists', block.newHandle, null);
    }

    if (block.newDecor) {
      result.decor = translate(
        dictionaries,
        'addition_colors',
        block.newDecor,
        null,
      );
    }
  });

  return result;
}

/** Langtext: блок характеристик позиции, как в коммерческом предложении */
function buildLong(order, dictionaries, product) {
  var rolet = roletSource(product);

  if (rolet) {
    return buildRoletLong(rolet);
  }

  var parts = [];
  var template = templateSource(product);

  // Название ручки в КП идёт без подписи, поэтому label необязателен
  function add(label, value) {
    if (value !== null && value !== undefined && value !== '') {
      parts.push(label ? label + ': ' + value : String(value));
    }
  }

  add(LABELS.system, systemName(dictionaries, product));

  var profile = profileSpec(dictionaries, product);

  add(LABELS.frameType, frameType(product));
  add(LABELS.chambers, profile.cameras);
  add(
    LABELS.frameThermal,
    profile.heatCoeff
      ? profile.heatCoeff.toFixed(2) + ' ' + LABELS.thermalUnit
      : null,
  );

  var outside = laminationName(dictionaries, product.lamination_out_id);
  var inside = laminationName(dictionaries, product.lamination_in_id);
  var color;

  if (outside && inside && outside !== inside) {
    color =
      outside +
      ' (' +
      LABELS.outside +
      '), ' +
      inside +
      ' (' +
      LABELS.inside +
      ')';
  } else {
    color = outside || inside;
  }

  add(LABELS.profileColor, color);
  add(LABELS.glazingUnit, glazingSpec(dictionaries, product).join(' / '));
  add(LABELS.hardware, hardwareName(dictionaries, product));

  var handle = handleSpec(dictionaries, product);

  add(null, handle.handle);
  add(LABELS.handleHeight, handle.height);
  add(LABELS.decorColor, handle.decor);

  add(
    LABELS.size,
    sizeText(product.template_width, product.template_height).replace('*', 'x'),
  );
  add(LABELS.area, toNumber(product.template_square).toFixed(2) + ' m2');
  add(LABELS.perimeter, perimeter(product).toFixed(2));
  add(LABELS.weight, weight(template, product));
  add(
    LABELS.accessories,
    accessoryNames(order, dictionaries, product).join(', '),
  );

  return parts.filter(Boolean).join(', ');
}

/** Периметр конструкции в метрах — так же считает КП */
function perimeter(product) {
  return (
    (2 *
      (parseInt(product.template_width, 10) +
        parseInt(product.template_height, 10))) /
    1000
  );
}

/** Вес конструкции с доп. элементами, кг */
function weight(template, product) {
  if (!template) {
    return null;
  }

  var qty = parseInt(product.product_qty, 10) || 1;
  var total =
    (toNumber(template.weightAddElements) +
      toNumber(template.weightConstruction)) *
    qty;

  return total > 0 ? total.toFixed(2) : null;
}

exports.loadDictionaries = loadDictionaries;
exports.buildShort = buildShort;
exports.buildLong = buildLong;
