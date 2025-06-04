var models = require('../models');
var i18n = require('i18n');
var async = require('async');
var _ = require('lodash');

var pieceSet = [16, 17, 18, 23, 24, 27, 14]; // Штучные:
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

function formContent (order, factory, userDiscounts, currUserId, additionalProductsIds, callback) {
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
  
  models.elements.findAll({}).then(function(elements){
    var listsForPDF,
    elementsForPDF,
    glassesFoldersForPDF,
    prodGlassInfo = [],
    dataObj = {};

    elementsForPDF = elements;

    models.glasses_folders.findAll({}).then(function(glasses_folders){
      glassesFoldersForPDF = glasses_folders;
      
      models.lists.findAll({}).then(function(lists){
        listsForPDF = lists;
        dataObj.listsData = listsForPDF;
        dataObj.elementsData = elementsForPDF;

        models.profile_systems.findAll({}).then(function(profile_sys){
          dataObj.profileSysData = profile_sys;

          models.doors_groups.findAll({}).then(function(doors_groups) {
            dataObj.doorsGroupsData = doors_groups;

            models.regions.findOne({where: {id: order.user.dataValues.city.region_id}}).then(function(region){
              var heat_coef_norm = region.heat_transfer;
           
        
  models.users_discounts.find({
    where: {
      user_id: order.user.dataValues.id
    },
    attributes: ['max_construct', 'max_add_elem', 'default_construct', 'default_add_elem']
  }).then(function(createUserDiss){
    
  
    var products = order.order.order_products;
    var products_length = products.length;

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
        const arrayTableNames = ["lists","doors_groups","profile_systems","doors_hardware_groups", "window_hardware_groups", "mosquitos", "mosquitos_singles", "lamination_factory_colors", "glass_folders", "addition_colors"];
        const values = [];
        arrayTableNames.forEach(value => {
          values[value] = locales_names.filter(item => item.dataValues.table_name === value).reduce((acc, item) => {
            const dataValues = item.dataValues;
            acc[dataValues.table_id] = dataValues;
            return acc;
          }, {});
        })
        
      
        async.eachSeries(products, function (product, cb) {
          prodGlassInfo = [];
          let glassesProduct = product.glass_id.split(', ');
          glassesProduct.forEach(gl_id => {
            let step1 = listsForPDF.find(list => list.id === +gl_id);
            let step2 = elements.find(el => el.id === step1.parent_element_id);
            let step3 = glassesFoldersForPDF.filter(fol => fol.element_id === step1.parent_element_id)
            .map(fol => values["glass_folders"][fol.glass_folders_id]);

            let objInfo = {
              gl_id: gl_id,
              gl_width: step2.glass_width,
              gl_transcalency: step2.transcalency,
              gl_noise_coeff: step2.noise_coeff,
              gl_list_folders: step3
            };
            prodGlassInfo.push(objInfo);
          })
          
          if(+currUserId !== +order.user.dataValues.id) {
            product.template_price = product.template_price/currencyValue / (1 + createUserDiss.default_construct / 100);
            product.addelem_price = product.addelem_price/currencyValue / (1 + createUserDiss.default_add_elem / 100);  
          } else {
            product.template_price = product.template_price/currencyValue;
            product.addelem_price = product.addelem_price/currencyValue;  
          }
          
          data.square += +(product.template_square * product.product_qty);
          data.basePrice += +(parseFloat(product.template_price * product.product_qty).toFixed(2));
          data.basePriceDisc += +(parseFloat(product.template_price * product.product_qty).toFixed(2) - parseFloat(parseFloat(product.template_price * (order.discount_construct / 100)) * product.product_qty)).toFixed(2);
          data.additionalPrice += +(parseFloat(product.addelem_price * product.product_qty).toFixed(2));
          data.additionalPriceDisc += +(parseFloat(product.addelem_price * product.product_qty) - parseFloat(+parseFloat(product.addelem_price * (order.discount_addelem / 100)) * product.product_qty)).toFixed(2);
          data.perimeter += +(((2 * (parseInt(product.template_width, 10) + parseInt(product.template_height, 10)))/1000) * product.product_qty);
          data.constructCounter += parseInt(product.product_qty, 10);
          data.content += __formProductContent(order.order.order_addelements, product, data.structCounter++, parsedOrder.laminations, parsedOrder.addElements, parsedOrder.glasses, parseFloat(parseFloat(product.template_price * product.product_qty) - ((parseFloat(product.template_price * parseFloat(order.discount_construct / 100))) * product.product_qty)), (parseFloat(product.addelem_price * product.product_qty).toFixed(2)) - parseFloat(+parseFloat(product.addelem_price * (order.discount_addelem / 100)) * product.product_qty).toFixed(2), values, prodGlassInfo, dataObj, heat_coef_norm, products_length);
          cb();
        }, function (err) {
          formAdditionals();
        });
      })
    });
    
    function formAdditionals () {
      var currentLanguage = i18n.getLocale();
      var filteredAddElements = [];

      models.locales_names.findAll({
        where: { factory_id: factory, table_attr: 'name' }
      }).then(function (locales_names) {
        const arrayTableNames = ["lists","doors_groups","profile_systems","doors_hardware_groups", "window_hardware_groups", "mosquitos", "mosquitos_singles", "lamination_factory_colors", "glass_folders", "addition_colors"];
        const values2 = [];

        arrayTableNames.forEach(value => {
          values2[value] = locales_names.filter(item => item.dataValues.table_name === value).reduce((acc, item) => {
            const dataValues = item.dataValues;
            acc[dataValues.table_id] = dataValues;
            return acc;
          }, {});
        })

      if (!additionalProductsIds || !additionalProductsIds.length) return callback(data);
      var additionals = order.order.order_addelements.filter(function (additional) {
        return additionalProductsIds.indexOf(additional.product_id) !== -1;
      });

      if (!additionals || !additionals.length) return callback(data);

      var addElementsQty = 0;
      var addElementsCount = 1;
      var additionalContent = 
      async.eachSeries(additionals, function (additional, _cb) {
        data.additionalPrice += +(parseFloat(additional.element_price * additional.element_qty).toFixed(2));
        data.additionalPriceDisc += +(parseFloat(additional.element_price * additional.element_qty) - parseFloat(+parseFloat(additional.element_price * (order.discount_addelem / 100)) * additional.element_qty)).toFixed(2);
        // data.perimeter += +(((2 * (parseInt(additional.element_width, 10) + parseInt(additional.element_height, 10)))/1000) * additional.element_qty);
        // data.constructCounter += parseInt(additional.element_qty, 10);
        var length = additional.element_width ? additional.element_width : null;
        var height = additional.element_height ? ('*' + additional.element_height) : null;
        additionalContent += additional.name + '(' + length + height + parseInt(additional.element_qty, 10) + ' ' + i18n.__('pcs') + ')';

        let translateAddElem = additional.name;
        if (values2["lists"][additional.element_id]) {
          translateAddElem = values2["lists"][additional.element_id][currentLanguage];
        }
        if (values2["mosquitos"][additional.element_id]) {
          translateAddElem = values2["mosquitos"][additional.element_id][currentLanguage];
        }
        if (values2["mosquitos_singles"][additional.element_id]) {
          translateAddElem = values2["mosquitos_singles"][additional.element_id][currentLanguage];
        }
        if (!translateAddElem.length) {
          translateAddElem = additional.name;
        }

        filteredAddElements.push((addElementsCount + '. ' + translateAddElem + '<br>' + (!+additional.element_width ? '' : (i18n.__('Width') + ' ' + additional.element_width + ' ' + i18n.__('mm') + ' ' + ' / ')) + (!+additional.element_height ? '' : (i18n.__('Length') + ' ' + additional.element_height + ' ' + i18n.__('mm') + ' ' + ' / ')) + additional.element_qty + ' ' +i18n.__('pcs')));
        
        
        addElementsQty += additional.element_qty;
        addElementsCount+=1;
        /**
         * 
              '<div>' + i18n.__('Amount') + ': ' +  + ' ' + '</div>' +
              '<div>' + i18n.__('width') + ': ' + parseInt(additional.element_width, 10) + ' ' + i18n.__('mm') + ' &nbsp;&nbsp; ' + i18n.__('height') + ': ' + parseInt(additional.element_height, 10) + ' ' + i18n.__('mm') + '</div>' +
              i18n.__('Perimeter') + ': ' + (((2 * (parseInt(additional.element_width, 10) + parseInt(additional.element_height, 10)))/1000) * additional.element_qty) + ' ' + i18n.__('m') +
              */
             _cb();
            }, function (err) {
              data.content += __formAdditionalContent(filteredAddElements, data.structCounter++, data.additionalPriceDisc);
              callback(data);
            });
            });
          }
        });
        });
        });
        })
      });
    });
  });
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
  function __formProductContent (orderAddElements, product, structCounter, laminations, addElements, glasses, productPrice, addElemPrice, translateLists, prodGlassInfo, dataObj, normalCoef, products_length) {
    var currentLanguage = i18n.getLocale();
    var productTemplate = JSON.parse(product.template_source);
    var heightHandle;
    var handleName;
    var decorName;
    var content = '';
    var divider = '';
    var filteredHardware = '';
    var filteredLaminations = [];
    var filteredAddElements = [];
    var filteredGlasses = [];
    var productGlasses = product.glass_id.split(', ');
    var addElementsQty = 0;
    var curProfile;
    var productPerimeter = +((2 * (parseInt(product.template_width, 10) + parseInt(product.template_height, 10)))/1000);   

    if (product.construction_type == 4) {
      curProfile = dataObj.doorsGroupsData.find(prof => prof.id === product.door_group_id);
      if(translateLists["lists"][product.door_handle_shape_id]) {
        var doorHandleName = translateLists["lists"][product.door_handle_shape_id][currentLanguage];
      }
      if(productTemplate.details[0].door_hinge && productTemplate.details[0].door_hinge.count > 1) {
        var doorHingeName = translateLists["lists"][productTemplate.details[0].door_hinge.id] ? translateLists["lists"][productTemplate.details[0].door_hinge.id][currentLanguage] : productTemplate.details[0].door_hinge.name;
        var doorHingeCount = productTemplate.details[0].door_hinge.count;
      }
    } else {
      curProfile = dataObj.profileSysData.find(prof => prof.id === product.profile_system.id);
    } 
    var qtyCameras = curProfile.cameras || ' ';
    var countryProfile = curProfile.country || ' ';
    var heatCoeffProfile = 1/curProfile.heat_coeff_value || ' ';
    var isWithoutHandle = 0;
    productTemplate.details.forEach((block, index) => {
      if (index == 0 && block.isWithoutHandle) {
        isWithoutHandle = 1;
      }
      if (block.blockType == 'sash' && block.heightHandle && block.heightHandle > 0) {
        heightHandle = block.heightHandle;
      }

      if (block.blockType == 'sash' && block.heightHandle !== undefined && block.heightHandle === 0) {
        heightHandle = 'Center';
      } 

      if(block.newHandle) {
        handleName = translateLists["lists"][block.newHandle][currentLanguage];
      }
      if(block.newDecor && translateLists["addition_colors"][block.newDecor]) {
        decorName = translateLists["addition_colors"][block.newDecor][currentLanguage];
      }
    })

    if (products_length > 1 && structCounter === 1 || structCounter%3 == 0) {
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

    var addElemProdQty = 0;
    /** Set additional elements of current product */
    for (var k = 0, len3 = orderAddElements.length; k < len3; k++) {
      if (orderAddElements[k].product_id === product.product_id) {   
        addElemProdQty++;
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
          filteredAddElements.push(('&#9679 ' + translateAddElem + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + i18n.__('Width') + ' ' + orderAddElements[k].element_width + ' ' + i18n.__('mm') + ' ' + ' / ' + orderAddElements[k].element_qty + ' ' + i18n.__('pcs')));
        } else if (pieceSet.indexOf(addElements[orderAddElements[k].element_id].group_id) !== -1 && addElements[orderAddElements[k].element_id].group_id !== 14) {
          filteredAddElements.push(('&#9679 ' + translateAddElem + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + orderAddElements[k].element_qty + ' ' + i18n.__('pcs')));
        } else if (pieceSet.indexOf(addElements[orderAddElements[k].element_id].group_id) !== -1 && addElements[orderAddElements[k].element_id].group_id == 14) {
          filteredAddElements.push(('&#9679 ' + translateAddElem + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + i18n.__('Height') + ' ' + orderAddElements[k].element_height + ' ' + i18n.__('mm') + '. ' + (orderAddElements[k].block_id == 0? i18n.__('Left'): i18n.__('Right')) + ' / ' + orderAddElements[k].element_qty + ' ' + i18n.__('pcs')));
        } else {
          filteredAddElements.push(('&#9679 ' + translateAddElem + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + i18n.__('Width') + ' ' + orderAddElements[k].element_width + ' ' + i18n.__('mm') + ' ' + ' / ' + i18n.__('Length') + ' ' + orderAddElements[k].element_height + ' ' + i18n.__('mm') + ' ' + ' / ' + orderAddElements[k].element_qty + ' ' +i18n.__('pcs')));
        }
        addElementsQty += orderAddElements[k].element_qty;
      }
    }

    if (productGlasses.length) {
      for (var l = 0 , len4 = productGlasses.length; l < len4; l++) {
        if (translateLists["lists"][+productGlasses[l]] === undefined) {
          filteredGlasses.push(glasses[productGlasses[l]]);
        } else {
          if(!translateLists["lists"][+productGlasses[l]][currentLanguage].length){
            filteredGlasses.push(glasses[productGlasses[l]]);
          } else {
            filteredGlasses.push(translateLists["lists"][+productGlasses[l]][currentLanguage]);
          }
        }
      }
    }

    const getTranslatedName = (list, id, language, defaultName) => {
      return (list[id] && list[id][language].length) ? list[id][language] : defaultName;
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

    let heat_coef_norma = 230 - ((+normalCoef - 0.89) / (2.84 - 0.89))* 230;
    let heat_coef_width = 230 - ((product.heat_coef_total - 0.89) / (2.84 - 0.89))* 230;
    
    /** Form content */
    return content =  `<div class="bound">` +
    '<div class="header-product">' +
      '<div class="product-counter">' +
        i18n.__('Position') + ' ' + structCounter + 
      '</div>' +
      '<div class="product-description">' +
        i18n.__('Constructions') + ': ' + parseInt(product.product_qty, 10) + i18n.__('pcs') + ' / ' + i18n.__('Size') + ': ' + parseInt(product.template_width, 10) +  i18n.__('x') + parseInt(product.template_height, 10) + ' / ' + i18n.__('Area_orders') + ': ' + parseFloat(product.template_square).toFixed(2) + ' / ' + i18n.__('Perimeter') + ' : ' + productPerimeter + ' / ' + i18n.__('Add. elements') + ': ' + addElementsQty + i18n.__('pcs') + 
      '</div>' +
    '</div>' +
    '<div class="product">' + 
      '<div class="product-container">' +
        '<div class="product-svg-container" align="left">' +
          '<div class="schemes" id="scheme' + product.id + '" value="' + product.id + '">' +
          '</div>' +
          '<div class="heat-coeff-block">' +
            '<div class="line-coeff-under">' +
            '</div>' +
            // '<div class="line-coeff-under2">' +
            // '</div>' +
            `<div class="flag-coeff-normal" style="left: ${heat_coef_norma}px">` +
            '</div>' +
            `<div class="flag-coeff" style="left: ${heat_coef_width}px">` +
            '</div>' +
          '</div>' +
          '<div class="info-titel">' +
            '<div>' +
              i18n.__('Thermal_conductivity') + ' U = ' + product.heat_coef_total + ' ' + i18n.__('U_coeff_short') +
            '</div>' +
          '</div>' +
          // (parseFloat(addElemPrice).toFixed(2) > 0 ?
          // '<div class="addelem-price">' +
          //   '<div class="addelem-price-name">' +
          //     i18n.__('Price of add. elements') +
          //   '</div>' +
          //   '<div class="addelem-price-value">' +
          //     parseFloat(addElemPrice).toFixed(2) +
          //   '</div>' +
          // '</div>' : " " ) +
          // '<div class="product-price">' +
          //   '<div class="product-price-name">' +
          //     i18n.__('Price of constructions') +
          //   '</div>' +
          //   '<div class="product-price-value">' +
          //     parseFloat(productPrice).toFixed(2) +
          //   '</div>' +
          // '</div>' +
        '</div>' +
        '<div class="product-info-conteiner" >' +
          '<div class="info-titel">' +
            '<div>' +
              i18n.__('Profile system') + ' ' + product.profile_system.name +
            '</div>' +
          '</div>' +
          (product.construction_type === 4 ?
          '<div class="info-sub-titel">' +
            '<div>' +
              (product.door_type_index === 0 ? i18n.__('Frame type') + ': ' + i18n.__('Perimeter frame') : '') +
              (product.door_type_index === 1 ? i18n.__('Frame type') + ': ' + i18n.__('Frame without threshold') : '') +
              (product.door_type_index === 3 || product.door_type_index === 2 ? i18n.__('Frame type') + ': ' + i18n.__('Frame with aluminum threshold') : '') +
            '</div>' +
          '</div>' : '' ) +
          '<div class="info-sub-titel">' +
            '<div>' +
              i18n.__('Amount of cameras') + ': ' + qtyCameras + ' / ' +
              i18n.__('Thermal_conductivity') + ': ' + heatCoeffProfile.toFixed(2) + 
              // i18n.__('Country') + ': ' + countryProfile +
            '</div>' +
          '</div>' +
          '<div class="info-sub-titel">' +
            '<div>' +
              i18n.__('Profile color') + ' ' + (filteredLaminations.length ? filteredLaminations.join(', ') : i18n.__('Not exist')) +
            '</div>' +
          '</div>' +

          filteredGlasses.map((glass, index) => (
            '<div class="info-titel">' +
              '<div>' +
                i18n.__('Glazed window') + ' ' + glass +
              '</div>' +
            '</div>' +
            '<div class="info-sub-titel">' +
              '<div>' +
                i18n.__('Width') + ' ' + prodGlassInfo[index].gl_width + i18n.__('mm') + ' / ' + i18n.__('Noise isolation (dB)') + ': ' + prodGlassInfo[index].gl_noise_coeff + ' / ' + '<br>' + i18n.__('Thermal_conductivity') + ': ' + (1/prodGlassInfo[index].gl_transcalency).toFixed(2) + 
              '</div>' +
            '</div>' + 
            '<div class="info-sub-titel">' +
              '<div>' +
                i18n.__('Glazed window type') + ': ' + prodGlassInfo[index].gl_list_folders.map(fl=>fl[currentLanguage]).join(' / ') + 
              '</div>' +
            '</div>'
          )).join('') +

          '<div class="info-titel">' +
            '<div>' +
              i18n.__('Hardware') + ' ' +
              //product.window_hardware.name +
              filteredHardware +
            '</div>' +
          '</div>' +
          (isWithoutHandle ? 
          '<div class="info-sub-titel">' +
            '<div>' +
              i18n.__('NO_HANDLE') +
            '</div>' +
          '</div>' : ' ') +
          (product.construction_type === 4 && doorHandleName ? 
          '<div class="info-sub-titel">' +
            '<div>' +
              doorHandleName +
            '</div>' +
          '</div>' : ' ') +
          (handleName !== undefined ? 
          '<div class="info-sub-titel">' +
            '<div>' +
              handleName +
            '</div>' +
          '</div>' : ' ') +
          (heightHandle !== undefined ?
          '<div class="info-sub-titel">' +
            '<div>' +
              i18n.__('Height to handle') +
              ' : ' + heightHandle + (heightHandle === 'Center' ? "" : i18n.__('mm')) + ' / ' +
              (decorName !==undefined ? 
                (i18n.__('Color of decors') +
                ' : ' + decorName ) : ' '
              ) + 
            '</div>'  +
          '</div>' : ' ') +
          (product.construction_type === 4 && doorHingeName ? 
          '<div class="info-sub-titel">' +
            '<div>' +
              doorHingeCount + i18n.__('pcs') + ' ' + doorHingeName +
            '</div>' +
          '</div>' : ' ') +
          // test price right
          '<div class="info-prod-price">' +
            '<div class="product-price-name">' +
              i18n.__('Price of constructions') +
            '</div>' +
            '<div class="product-price-value">' +
              parseFloat(productPrice).toFixed(2) +
            '</div>' +
          '</div>' +
          (parseFloat(addElemPrice).toFixed(2) > 0 ?
          '<div class="info-add-price">' +
            '<div class="addelem-price-name">' +
              i18n.__('Price of add. elements') +
            '</div>' +
            '<div class="addelem-price-value">' +
              parseFloat(addElemPrice).toFixed(2) +
            '</div>' +
          '</div>' : " " ) +
          // 
          '<div class="info-titel">' +
            i18n.__('Add. elements') +
          '</div>' +  
          '<div class="info-sub-titel">' +
            '<div>' +
              (filteredAddElements.length ? filteredAddElements.join('<br>') : i18n.__('Not exist')) +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '</div></div>' + 
      `<div class="footer-pdf"; style="opacity: ${structCounter == products_length ? 1 : 0};">` + 
        '<div class="customer-sign">' +
          i18n.__('Customer_pdf') +
          '<span class="signature">' +
          '</span>' +
        '</div>'+
        '<div class="salon-sign">' + 
          i18n.__('Salon_pdf') +
          '<span class="signature">' +
          '</span>' +
        '</div>' +
      '</div>' +
      `<div class="small-logo-pdf-wrapp-print">` +
        `<img class="small-logo-pdf"; style="bottom: ${products_length > 1 && structCounter % 2 == 0 ? -575 : -50}px; display: ${structCounter == 1 || structCounter % 2 == 0 ? 'block' : 'none'};"; src="https://admin.ekipazh.windowscalculator.net/assets/images/small-logo-pdf.png">` +
      '</div>'
      // `<div class="small-logo-pdf-wrapp-web">` +
      //   `<img class="small-logo-pdf"; style="bottom: ${ structCounter == products_length ? -25 : 10}px;"; src="https://admin.ekipazh.windowscalculator.net/assets/images/small-logo-pdf.png">` +
      // '</div>'
      // .row(style="font-size: 13px")
      //   .col-md-6
      //     =i18n.__('Customer_pdf')
      //     | 
      //     span.signature
      //       | 
      //   .col-md-6
      //     =i18n.__('Salon_pdf')
      //     | 
      //     span.signature
      //       | 
      // divider ;
  }

  function __formAdditionalContent (additionalContent, structCounter, addPriceDisc) {
    var divider = '';

    if (structCounter%3 == 0) {
      divider = '<div class="construct-divider"> </div>';
    }

    return divider + '<div class="bound">' +
      '<div class="header-product">' +
        '<div class="product-counter">' +
          i18n.__('Position') + ' ' + structCounter + 
        '</div>' +
      '</div>' +
      '<div class="add-container">' +
        '<div class="add-svg-container">' +
          '<div class="add-product-svg">' +
            '<img class="additional-logo-new" src="https://admin.ekipazh.windowscalculator.net/assets/images/add.png" alt="Add">' +
          '</div>' +
          '<div class="addelem-price">' +
            '<div class="addelem-price-name">' +
              i18n.__('Price of add. elements') +
            '</div>' +
            '<div class="addelem-price-value">' +
              parseFloat(addPriceDisc).toFixed(2) +
            '</div>' +
          '</div>'+
        '</div>' +
        '<div class="add-description">' +
          '<div class="info-titel">' +
            i18n.__('Add. elements') +
          '</div>' +  
          '<div class="info-sub-titel">' +
            '<div>' +
              additionalContent.join('<br>') +
            '</div>' +
          '</div>' +
        '</div>' +  
      '</div>' +
    '</><hr>';
  }