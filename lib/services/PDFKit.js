var models = require('../models');
var i18n = require('i18n');
var async = require('async');
var _ = require('lodash');

var pieceSet = [16, 17, 18, 23, 24, 27]; // Штучные:
var mouldedSet = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 19, 21, 22, 25, 30, 31, 32]; // Погонажные: !Уплотнители отсутствуют
var surfaceSet = [6, 20, 26, 28, 29]; // Поверхностные:

var currencyValue = 1; // для пересчета на другую валюту;

exports.formContent = formContent;
exports.parseOrder = parseOrder;

/**
 * Parse order
 * @param {object} order - Current order
 * @param {integer} factory - Factory Id of passed order
 * @callback done
 */
function parseOrder (order, factory, done) {
  var filteredElements = [-1];
  var filteredSets = [-1];
  var filteredLaminations = [-1];
  var filteredAddElements = [-1];
  var filteredMosquitos = [-1];
  var filteredGlasses = [-1];
  var mergedGlasses = [-1];
  var filteredHardwares = [-1];

  /** Filter all hardwares */
  order.order_products.map(function (product) {
    if (product.window_hardware_group && product.window_hardware_group.name) {
      filteredHardwares.push({
        id: product.window_hardware_group.id,
        name: product.window_hardware_group.name
      });
    }
  });

  /** Filter all laminations */
  order.order_products.map(function (product) {
    if (filteredLaminations.indexOf(product.lamination_out_id) === -1) {
      filteredLaminations.push(parseInt(product.lamination_out_id, 10));
    }
    if (filteredLaminations.indexOf(product.lamination_in_id) === -1) {
      filteredLaminations.push(parseInt(product.lamination_in_id, 10));
    }
  });

  /** Filter all glasses */
  order.order_products.map(function (product) {
    filteredGlasses.push(product.glass_id.split(', '));
  });
  /** Merge glasses array */
  mergedGlasses = [].concat.apply([], filteredGlasses);

  /** Filter order additional elements */
  order.order_addelements.map(function (addElement) {
    if (addElement.element_type === 0 && addElement.product_id !== 0) {
      filteredMosquitos.push({ id: addElement.element_id, name: addElement.name });
    } else if (addElement.product_id !== 0) {
      filteredAddElements.push(addElement.element_id);
    }
  });

  async.parallel([
    /** Find all order laminations */
    function (callback) {
      if (filteredLaminations.length) {
        models.lamination_factory_colors.findAll({
          where: {
            factory_id: factory,
            lamination_type_id: {
              $in: filteredLaminations
            }
          },
          attributes: ['id', 'name', 'lamination_type_id']
        }).then(function (orderLaminations) {
          console.log('!!!!!!!!!!!!!!!filteredLaminations', filteredLaminations);
          /** If white lamination exist - push it */
          if (filteredLaminations.indexOf(1) !== -1) {
            orderLaminations.push({
              id: 1,
              name: i18n.__('White'),
              lamination_type_id: 1
            });
          }

          callback(null, orderLaminations);
        }).catch(function (err) {
          console.log(err);
          callback(null, []);
        });
      } else {
        callback(null, []);
      }
    },
    /** Find all order additional elements */
    function (callback) {
      models.lists.findAll({
        where: {
          id: {
            $in: _.compact(filteredAddElements)
          }
        },
        attributes: ['id', 'name', 'list_group_id']
      }).then(function (orderAddElements) {
        var parsedAddElements = [];

        orderAddElements.map(function (addElement) {
          parsedAddElements[addElement.id] = { name: addElement.name, group_id: addElement.list_group_id };
        });

        filteredMosquitos.map(function (mosquito) {
          parsedAddElements[mosquito.id] = { name: mosquito.name, group_id: 0 };
        });

        callback(null, parsedAddElements);
      }).catch(function (err) {
        console.log(err);
        callback(null, []);
      });
    },
    /** Find all order glasses */
    function (callback) {
      models.lists.findAll({
        where: {
          id: {
            $in: _.compact(mergedGlasses)
          }
        },
        attributes: ['id', 'name']
      }).then(function (orderGlasses) {
        var parsedGlasses = [];

        orderGlasses.map(function (glass) {
          parsedGlasses[glass.id] = glass.name;
        });

        callback(null, parsedGlasses);
      }).catch(function (err) {
        console.log(err);
        callback(null, []);
      });
    }
  ], function (err, results) {
    done({
      hardwares: filteredHardwares,
      laminations: results[0],
      addElements: results[1],
      glasses: results[2]
    });
  });
};

/**
 * Form products
 * @param {object} order - Specified order
 * @param {integer} factory - Order factory
 * @param {object} userDiscounts - User's discounts
 * @callback - callback
 */

function formContent (order, factory, userDiscounts, additionalProductsIds, callback) {
  var data = {
    structCounter: 1,
    constructCounter: 0,
    content: '',
    square: 0,
    basePrice: 0,
    basePriceDisc: 0,
    additionalPrice: 0,
    additionalPriceDisc: 0,
    perimeter: 0
  };

  var products = order.order.order_products;

  if (!products || !products.length) return formAdditionals();

  parseOrder(order.order, factory, function (parsedOrder) {
    models.currencies.findAll({
      where: {
        factory_id: factory, 
        id: order.user.dataValues.currencies_id
      }
    }).then(userInfo=>{
      if(userInfo[0].id === 102) {
        currencyValue = userInfo[0].value;
      }
      if(userInfo[0].id === 685) {
        currencyValue = userInfo[0].value;
      }
      if(userInfo[0].id === 684) {
        currencyValue = userInfo[0].value;
      }
    });
    
    models.locales_names.findAll({
      where: { factory_id: factory, table_attr: 'name' }
    }).then(function (locales_names) {
      const arrayTableNames = ["lists","doors_groups","profile_systems","doors_hardware_groups", "window_hardware_groups", "mosquitos", "mosquitos_singles", "lamination_factory_colors"];
      const values = [];
      arrayTableNames.forEach(value => {
        values[value] = locales_names.filter(item => item.dataValues.table_name === value).reduce((acc, item) => {
          const dataValues = item.dataValues;
          acc[dataValues.table_id] = dataValues;
          return acc;
        }, {});
      })
      
     
      async.eachSeries(products, function (product, cb) {
        product.template_price = product.template_price/currencyValue;
        product.addelem_price = product.addelem_price/currencyValue;

        data.square += +(product.template_square * product.product_qty);
        data.basePrice += +(parseFloat(product.template_price * product.product_qty).toFixed(2));
        data.basePriceDisc += +(parseFloat(product.template_price * product.product_qty).toFixed(2) - parseFloat(parseFloat(product.template_price * (order.discount_construct / 100)) * product.product_qty)).toFixed(2);
        data.additionalPrice += +(parseFloat(product.addelem_price * product.product_qty).toFixed(2));
        data.additionalPriceDisc += +(parseFloat(product.addelem_price * product.product_qty) - parseFloat(+parseFloat(product.addelem_price * (order.discount_addelem / 100)) * product.product_qty)).toFixed(2);
        data.perimeter += +(((2 * (parseInt(product.template_width, 10) + parseInt(product.template_height, 10)))/1000) * product.product_qty);
        data.constructCounter += parseInt(product.product_qty, 10);
        data.content += __formProductContent(order.order.order_addelements, product, data.structCounter++, parsedOrder.laminations, parsedOrder.addElements, parsedOrder.glasses, parseFloat(parseFloat(product.template_price * product.product_qty) - ((parseFloat(product.template_price * parseFloat(order.discount_construct / 100))) * product.product_qty)), (parseFloat(product.addelem_price * product.product_qty).toFixed(2)) - parseFloat(+parseFloat(product.addelem_price * (order.discount_addelem / 100)) * product.product_qty).toFixed(2), values);
        cb();
      }, function (err) {
        formAdditionals();
      });
    })
  });

  function formAdditionals () {
    if (!additionalProductsIds || !additionalProductsIds.length) return callback(data);
    var additionals = order.order.order_addelements.filter(function (additional) {
      return additionalProductsIds.indexOf(additional.product_id) !== -1;
    });

    if (!additionals || !additionals.length) return callback(data);

    var additionalContent = 
    async.eachSeries(additionals, function (additional, _cb) {
      data.additionalPrice += +(parseFloat(additional.element_price * additional.element_qty).toFixed(2));
      data.additionalPriceDisc += +(parseFloat(additional.element_price * additional.element_qty) - parseFloat(+parseFloat(additional.element_price * (order.discount_addelem / 100)) * additional.element_qty)).toFixed(2);
      // data.perimeter += +(((2 * (parseInt(additional.element_width, 10) + parseInt(additional.element_height, 10)))/1000) * additional.element_qty);
      // data.constructCounter += parseInt(additional.element_qty, 10);
      var length = additional.element_width ? additional.element_width : null;
      var height = additional.element_height ? ('*' + additional.element_height) : null;
      additionalContent += additional.name + '(' + length + height + parseInt(additional.element_qty, 10) + ' ' + i18n.__('pcs') + ')';
      /**
       * 
            '<div>' + i18n.__('Amount') + ': ' +  + ' ' + '</div>' +
            '<div>' + i18n.__('width') + ': ' + parseInt(additional.element_width, 10) + ' ' + i18n.__('mm') + ' &nbsp;&nbsp; ' + i18n.__('height') + ': ' + parseInt(additional.element_height, 10) + ' ' + i18n.__('mm') + '</div>' +
            i18n.__('Perimeter') + ': ' + (((2 * (parseInt(additional.element_width, 10) + parseInt(additional.element_height, 10)))/1000) * additional.element_qty) + ' ' + i18n.__('m') +
       */
      _cb();
    }, function (err) {
      data.content += __formAdditionalContent(additionalContent, data.structCounter++);
      callback(data);
    });
  }
}


  /**
   * Form product content
   * @param {array of objects} orderAddElements - additional elements in order
   * @param {object}           product          - current product
   * @param {integer}          structCounter    - product counter
   * @param {array of objects} hardwares        - all order hardwares
   * @param {array of objects} laminations      - all order laminations
   * @param {array of objects} addElements      - all parsed additional elements (lists)
   */ 
  function __formProductContent (orderAddElements, product, structCounter, laminations, addElements, glasses, productPrice, addElemPrice, translateLists) {
    var currentLanguage = i18n.getLocale();
    var productTemplate = JSON.parse(product.template_source);
    var heightHandle;
    var content = '';
    var divider = '';
    var filteredHardware = '';
    var filteredLaminations = [];
    var filteredAddElements = [];
    var filteredGlasses = [];
    var productGlasses = product.glass_id.split(', ');

    productTemplate.details.forEach(block => {
      if (block.blockType == 'sash' && block.heightHandle && block.heightHandle > 0) {
        heightHandle = block.heightHandle;
      } else {
        heightHandle = 'Centre';
      }
    })

    if (structCounter%3 == 0) {
      divider = '<div class="construct-divider"> </div>';
    }

    /** Set lamination of current product */
    for (var j = 0, len2 = laminations.length; j < len2; j++) {
      // console.log('in:', product.lamination_in_id, 'out:', product.lamination_out_id, laminations[j].lamination_type_id);
      let translateLaminName = laminations[j].name;
      if(laminations[j].id !== 1) {
        translateLaminName = translateLists["lamination_factory_colors"][laminations[j].id][currentLanguage];
      }
      if (!translateLaminName.length) {
        translateLaminName = laminations[j].name;
      }

      if (product.lamination_in_id === laminations[j].lamination_type_id) {
        filteredLaminations.push((translateLaminName + ' (' + i18n.__('inner') + ')'));
      }

      if (product.lamination_out_id === laminations[j].lamination_type_id) {
        filteredLaminations.push((translateLaminName + ' (' + i18n.__('outer') + ')'));
      }
    }

    /** Set additional elements of current product */
    for (var k = 0, len3 = orderAddElements.length; k < len3; k++) {
      if (orderAddElements[k].product_id === product.product_id) {   

        let translateAddElem = orderAddElements[k].name;
        if (translateLists["lists"][orderAddElements[k].element_id]) {
          translateAddElem = translateLists["lists"][orderAddElements[k].element_id][currentLanguage];
        }
        if (translateLists["mosquitos"][orderAddElements[k].element_id]) {
          translateAddElem = translateLists["mosquitos"][orderAddElements[k].element_id][currentLanguage];
        }
        if (translateLists["mosquitos_singles"][orderAddElements[k].element_id]) {
          translateAddElem = translateLists["mosquitos_singles"][orderAddElements[k].element_id][currentLanguage];
        }
        if (!translateAddElem.length) {
          translateAddElem = orderAddElements[k].name;
        }


        if (mouldedSet.indexOf(addElements[orderAddElements[k].element_id].group_id) !== -1) {
          filteredAddElements.push((translateAddElem + ' (' + orderAddElements[k].element_width + ',' + orderAddElements[k].element_qty + ' ' + i18n.__('pcs') +')'));
        } else if (pieceSet.indexOf(addElements[orderAddElements[k].element_id].group_id) !== -1) {
          filteredAddElements.push((translateAddElem + ' (' + orderAddElements[k].element_qty + ' ' + i18n.__('pcs') +')'));
        } else {
          filteredAddElements.push((translateAddElem + ' (' + orderAddElements[k].element_width + 'х' + orderAddElements[k].element_height + ',' + orderAddElements[k].element_qty + ' ' +i18n.__('pcs') +')'));
        }
      }
    }

    if (productGlasses.length) {
      for (var l = 0 , len4 = productGlasses.length; l < len4; l++) {
        if (translateLists["lists"][+productGlasses[l]] === undefined) {
          filteredGlasses.push(glasses[productGlasses[l]]);
        } else {
          filteredGlasses.push(translateLists["lists"][+productGlasses[l]][currentLanguage]);
        }
      }
    }

    const getTranslatedName = (list, id, language, defaultName) => {
      return list[id][language].length ? list[id][language] : defaultName;
    };
    product.profile_system = product.profile_system
      ? { name: getTranslatedName(translateLists["profile_systems"], product.profile_system.id, currentLanguage, product.profile_system.name) }
      : { name: getTranslatedName(translateLists["doors_groups"], product.doors_group.id, currentLanguage, product.doors_group.name) };


    if (product.window_hardware_group && translateLists["doors_hardware_groups"][product.window_hardware_group.id] !== undefined) {
      filteredHardware = getTranslatedName(translateLists["doors_hardware_groups"], product.window_hardware_group.id, currentLanguage, product.window_hardware_group.name)
    } else if (product.window_hardware_group && translateLists["window_hardware_groups"][product.window_hardware_group.id] !== undefined) {
      filteredHardware = getTranslatedName(translateLists["window_hardware_groups"], product.window_hardware_group.id, currentLanguage, product.window_hardware_group.name)
    } else {
      filteredHardware = i18n.__('Not exist');
    }

    /** Form content */
    return content = divider + '<div class="bound">' +
    '<div class="row product-top">' +
      '<div class="col-md-6">' +
        '<div class="product-counter">' +
          '<p class="counter-align">' + structCounter + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="col-md-6">' +
        '<div class="product-description">' +
          '<i>' + i18n.__('Amount') + ': ' + parseInt(product.product_qty, 10) + ' ' + i18n.__('pcs x') + ' ' + parseFloat(product.template_square).toFixed(2) + ' ' + i18n.__('m') + '<sup>2</sup>; ' +
          i18n.__('width') + ': ' + parseInt(product.template_width, 10) + ' ' + i18n.__('mm') + ' &nbsp;&nbsp; ' + i18n.__('height') + ': ' + parseInt(product.template_height, 10) + ' ' + i18n.__('mm') +
            '<br> ' + i18n.__('Area') + ': ' + (product.template_square * product.product_qty).toFixed(2) + ' ' + i18n.__('m') + '<sup>2</sup>' +
          '</i>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="product"><table border="0" cellspacing="0" cellpadding="0" style="font-size:12px; width: 100%;">' +
      '<tr class="product-container">' +
        '<td align="left">' +
          '<div class="schemes" id="scheme' + product.id + '" value="' + product.id + '">' +
          '</div>' +
        '</td>' +
        '<td>' +
          '<table class="product-table" border="0" cellspacing="0" cellpadding="0">' +
            '<tr class="">' +
              '<td style="width:200px; border-right:solid 1px #d1d2d4">' +
                i18n.__('Profile system') +
              '</td>' +
              '<td style="width:450px; padding-left:15px; color:#283891;">' +
                product.profile_system.name +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="border-right:solid 1px #d1d2d4">' +
                i18n.__('Glazed window(s)') +
              '</td>' +
              '<td style="color:#283891; padding-left:15px;">' +
                filteredGlasses.join(', ') +
              '</td>' +
            '</tr>' +
            '<tr class="">' +
              '<td style="width:200px; border-right:solid 1px #d1d2d4">' +
                i18n.__('Hardware') +
              '</td>' +
              '<td style="width:450px; padding-left:15px; color:#283891;">' +
                //product.window_hardware.name +
                filteredHardware +
                ' | ' +
                i18n.__('Handle') +
                ' : ' + heightHandle +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="border-right:solid 1px #d1d2d4">' +
                i18n.__('heat resistance') +
              '</td>' +
              '<td style="color:#283891; padding-left:15px;">' +
                product.heat_coef_total +
              '</td>' +
            '</tr>' +
            '<tr class="">' +
              '<td style="border-right:solid 1px #d1d2d4">' +
                i18n.__('Profile color') +
              '</td>' +
              '<td style="color:#283891; padding-left:15px;">' +
                (filteredLaminations.length ? filteredLaminations.join(', ') : i18n.__('Not exist')) +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="width:200px; border-right:solid 1px #d1d2d4">' +
                i18n.__('Add. elements') +
              '</td>' +
              '<td style="width:450px; padding-left:15px; color:#283891;">' +
                (filteredAddElements.length ? filteredAddElements.join(', ') : i18n.__('Not exist')) +
              '</td>' +
            '</tr>' +
            '<tr class="">' +
              '<td style="border-right:solid 1px #d1d2d4">' +
                i18n.__('Price of constructions') +
              '</td>' +
              '<td style="color:#283891; padding-left:15px;">' +
                parseFloat(productPrice).toFixed(2) +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="border-right:solid 1px #d1d2d4; border-bottom: none;">' +
                i18n.__('Price of add. elements') +
              '</td>' +
              '<td style="color:#283891; padding-left:15px; border-bottom: none;">' +
                parseFloat(addElemPrice).toFixed(2) +
              '</td>' +
            '</tr>' +
          '</table>' +
        '</td>' +
      '</tr></table>' +
      '</div></div><hr>';
  }

  function __formAdditionalContent (additionalContent, structCounter) {
    var divider = '';

    if (structCounter%3 == 0) {
      divider = '<div class="construct-divider"> </div>';
    }

    return divider + '<div class="bound">' +
      '<div class="row product-top">' +
        '<div class="col-md-6">' +
          '<div class="product-counter">' +
            '<p class="counter-align">' + structCounter + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
          '<div class="addelement-header">Дополнительный элемент:</div>' +
          '<div class="addelement-description">' +
            additionalContent +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="product row">' +
          '<img class="additional-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEKmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS4xLjIiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxMi0xMS0yNlQxOToxMTozOTwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAyLjEuMzwveG1wOkNyZWF0b3JUb29sPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+MTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MTwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4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">' +
      '</div>' +
    '</div><hr>';
  }