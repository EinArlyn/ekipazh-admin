var models = require('../../lib/models');
var async = require('async');
var writeToExcell = require('./writeProductAnalitics');

var startTime, stopTime, regions = {};
var sexes = ['', 'mas', 'fem'];
var ages = ['', 'ageF20', 'ageF31', 'ageF41', 'ageF51', 'ageF61'];
var ocupations = ['', 'employee', 'householder', 'employeer', 'student', 'pensioner', 'unknown'];
var sources = ['', 'tv', 'internet', 'press', 'friends', 'advertising'];

var fields = {
    profileCount: [],
    hardwareInfo: [],
    hardwareTypeInfo: [],
    glazzing: [],
    windowsills: [],
    frontSills: []
  };

module.exports = function(req, res, next) {
  var from = req.params.from.split('.');
  var to = req.params.to.split('.');
  startTime = (!isNaN(from[1]))? new Date(from[2], from[1] - 1, from[0]): new Date(0);
  stopTime = (!isNaN(to[1]))? new Date(to[2], to[1] - 1, to[0], 24): new Date();
  var fileName = 'Продукт по регионам(' + req.params.from + ' - ' + req.params.to +').xlsx';
  var factory_id = req.session.user.factory_id;//897;//940;
  var timeStart = '';
  getRegions(factory_id, function (err, regionsData) {
    console.log('1')
    getProfileSystemsInformation (factory_id, function (err, result) {
      console.log('2')
      getHardwareInformation(factory_id, function (err, result) {
        console.log('3')
        getOpenTypesInfo(factory_id, function (err, result) {
          console.log('4')
          openTypes (result, function (err, result) {
            console.log('4.1')
            getGlazingInfo(factory_id, function (err, result) {
              console.log('5')
              firstFiveOfGlazing(result, function (err, result) {
                console.log('6')
                getApertures(factory_id, function (err, result) {
                  console.log('7')
                  getMosquitos(factory_id, function (err, result) {
                    console.log('8')
                    getWindowsills(factory_id, function(err, result) {
                      console.log('9')
                      writeToExcell.writeToExcel(regions, fields, fileName, false, function (err, result) {
                        res.send({file: fileName});
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

function getProfileSystemsInformation (factoryId, callback) {
  models.order_products.findAll({
    include: [
      {model: models.profile_systems, required: true, attributes: ['name']},
      {model: models.orders,
        where: {
          factory_id: factoryId,
          sended: {$gt: new Date(0)},
          created: {$gt: startTime, $lt: stopTime}
        },
        include: [
          {model: models.cities,
            include: [{model: models.regions, attributes: ['name']}],
            attributes: ['id']
          },
          {model: models.users, attributes: ['name'], required: true}
        ],
        attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['profile_id']
  }).then(function (orders) {
    if (orders) {
      var region, prSystem;
      async.map(orders, function (order, _callback) {
        var sex = order.order.customer_sex;
        var age = order.order.customer_age;
        var occup = order.order.customer_occupation;
        var info = order.order.customer_infoSource;
        region = order.order.city.region.name;
        prSystem = order.profile_system.name;
        addInnerData(region, 'profiles', prSystem, 'profileCount', sex, age, occup, info);
        if (fields.profileCount.indexOf(prSystem) === -1) {
          fields.profileCount.push(prSystem);
        }
        _callback();
      }, function() {
        callback(null);
      });
    }
  });
}
function getRegions(factoryId, callback) {
  models.regions.findAll({
    include: [{model: models.cities,
      include: [
        {model: models.orders,
          where: {
            factory_id: factoryId,
            created: {$gt: startTime, $lt: stopTime},
            sended: {$gt: new Date(0)}
          },
          attributes: [],
          include: {model: models.users, attributes: [], required: true}
        }
      ],
      attributes: []
    }],
    attributes: ['name']
  }).then(function (orderCities) {
    var innerFields = sexes.slice(1)
    .concat(ages.slice(1))
    .concat(ocupations.slice(1))
    .concat(sources.slice(1));
    for (var i = 0; i < orderCities.length; i++) {
      regions[orderCities[i].name] = {
        profiles: {},
        hardwares: {},
        hardwareTypes: {},
        glazingTypes: {},
        apertures: 0,
        mosquitos: 0,
        windowsills: {},
        frontSills: {},
        hardwareCount: 0,
        profileCount: 0,
        hardwareTypesCount: 0,
        glazingCount: 0,
        windowsillCount: 0,
        frontSillsCount: 0
      };
      for (var j = 0; j < innerFields.length; j++) {
        regions[orderCities[i].name][innerFields[j]] = {
          profiles: {},
          hardwares: {},
          hardwareTypes: {},
          glazingTypes: {},
          apertures: 0,
          mosquitos: 0,
          windowsills: {},
          frontSills: {},
          hardwareCount: 0,
          profileCount: 0,
          hardwareTypesCount: 0,
          glazingCount: 0,
          windowsillCount: 0,
          frontSillsCount: 0
        };
      }
    }
    callback(null, regions);
  });
}
function getHardwareInformation(factoryId, callback) {
  models.order_products.findAll({
    include: [
      {model: models.window_hardware_groups, required: true, attributes: ['name']},
      {model: models.orders,
        where: {factory_id: factoryId, sended: {$gt: new Date(0)},
          created: {$gt: startTime, $lt: stopTime}},
        include: [
          {model: models.cities,
            include: [{model: models.regions, attributes: ['name']}],
            attributes: ['id']
          },
          {model: models.users, attributes: ['name'], required: true}
        ],
        attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['hardware_id']
  }).then(function (orders) {
    if (orders) {
      var i, region, hName, types = [];
      async.map(orders, function (order, _callback) {
        var sex = order.order.customer_sex;
        var age = order.order.customer_age;
        var occup = order.order.customer_occupation;
        var info = order.order.customer_infoSource;
        region = order.order.city.region.name;
        hName = order.window_hardware_group.name;
        addInnerData(region, 'hardwares', hName, 'hardwareCount', sex, age, occup, info);
        if (fields.hardwareInfo.indexOf(hName) === -1) {
          fields.hardwareInfo.push(hName);
        }
        _callback();
      }, function () {
        callback(null, types);
      });
    }
  });
}
function getOpenTypesInfo(factoryId, callback) {
  models.order_products.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}
      },
      include: [
        {model: models.cities,
          include: [{model: models.regions, attributes: ['name']}],
          attributes:['id']
        },
        {model: models.users, attributes: ['name'], required: true}
      ],
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['template_source']
  }).then(function (orders) {
    var i, region, hardwareName, types = [];
    async.map(orders, function (order, _callback) {
      var sashTypes = {}, sex, age, occup, info;

      sex = order.order.customer_sex;
      age = order.order.customer_age;
      occup = order.order.customer_occupation;
      info = order.order.customer_infoSource;
      region = order.order.city.region.name;
      var orderDetails;
      try {
        orderDetails = JSON.parse(order.template_source);
        if (orderDetails.details) {
          orderDetails.details.map(function (details) {
            if (details.sashType) {
              sashTypes[details.sashType] = sashTypes[details.sashType]? (+sashTypes[details.sashType]) + 1: 1;
            }
          });
        }
      } catch (err) {
        console.log(err);
        return _callback();
      }
      _callback(null, {region:region, sash: sashTypes, sex: sex, age: age, occup: occup, info: info});
    }, function (err, result) {
      callback(null, result);
    });
  }).catch(function (err) {
    console.log(err);
    callback(err);
  });
}

function getGlazingInfo(factoryId, callback) {
  var ids = [];
  models.order_products.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}},
      include: [
        {model: models.cities, include: [{model: models.regions, attributes: ['name']}], attributes: ['id']},
        {model: models.users, attributes: ['name'], required: true}
      ],
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['glass_id']
  }).then(function (glassIds) {
    var i, tempId;
    for (i = 0; i < glassIds.length; i++) {
      tempId = glassIds[i].glass_id.split(', ');
      for (var j = 0; j < tempId.length; j++) {
        if (!isNaN(parseInt(tempId[j]))) {
          ids.push(parseInt(tempId[j]));
        }
      }
    }
    return glassIds;
  }).then(function (glassIds) {
    models.elements.findAll({
      include: [{model:models.lists,
        where: {id: {in: ids}},
        attributes: ['id']
      }],
      attributes: ['sku']
    }).then(function (elements) {
      var i, j, gl, glazingData = {};
      elements.forEach(function (elem, it, elems) {
        glazingData[elem.sku] = 0;
        ids.forEach(function(id, i, arr) {
          elem.lists.forEach(function (list, l_item, l_arr) {
            if (id == list.id) {
              glazingData[elem.sku]++;
            }
          });
        });
      });
      var glassName, region, sex, age, occup, info;
      glassIds.forEach(function(product, g_item, products) {
        if (product.glass_id)
          product.glass_id.split(', ').forEach(function (list, l_item, lists) {
            sex = product.order.customer_sex;
            age = product.order.customer_age;
            occup = product.order.customer_occupation;
            info = product.order.customer_infoSource;
            region = product.order.city.region.name;
            glassName = elements.find(function (el, index, array) {
              if (el.lists.find(function (el_list, el_index, el_array) {
                if (el_list.id == +list) return true;
              })) return true;
            });
            if (glassName)
              addInnerData(region, 'glazingTypes', glassName.sku, 'glazingCount', sex, age, occup, info);
          });
      });
      callback(null, glazingData);
    }).catch(function (err) {
      console.log(err);
    });
  }).catch(function (err) {
    console.log(err);
  });
}
function getApertures(factoryId, callback) {
  models.order_products.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}},
      include: [
        {model: models.cities, include: [{model: models.regions, attributes: ['name']}], attributes: ['id']},
        {model: models.users, attributes: ['name'], required: true}
      ],
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['template_source']
  }).then(function (apertures) {
    var region;
    apertures.forEach(function (app, item, apps) {
      var details;
      try {
        details = JSON.parse(app.template_source).details;
        if (details) {
          details.forEach(function (det, d_item, arr) {
            if (!det.children.length) {
              region = app.order.city.region.name;
              regions[region].apertures++;
              if (app.order.customer_sex > 0) {
                regions[region][sexes[app.order.customer_sex]].apertures++;
              }
              if (app.order.customer_age > 0) {
                regions[region][ages[app.order.customer_age]].apertures++;
              }
              if (app.order.customer_occupation > 0) {
                regions[region][ocupations[app.order.customer_occupation]].apertures++;
              }
              if (app.order.customer_infoSource > 0) {
                regions[region][sources[app.order.customer_infoSource]].apertures++;
              }
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
    callback(null);
  }).catch(function(err) {
    console.log(err);
  });
}
function getMosquitos(factoryId, callback) {
  models.order_addelements.findAll({
    where: {element_type: 0},
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}},
      include: [
        {model: models.cities, include: [{model: models.regions, attributes: ['name']}], attributes: ['id']},
        {model: models.users, attributes: ['name'], required: true}
      ],
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['id']
  }).then(function (mosquitos) {
    var i, region;
    mosquitos.forEach(function (order, item, orders) {
      region = order.order.city.region.name;
      regions[region].mosquitos++;
      if (order.order.customer_sex > 0) {
        regions[region][sexes[order.order.customer_sex]].mosquitos++;
      }
      if (order.order.customer_age > 0) {
        regions[region][ages[order.order.customer_age]].mosquitos++;
      }
      if (order.order.customer_occupation > 0) {
        regions[region][ocupations[order.order.customer_occupation]].mosquitos++;
      }
      if (order.order.customer_infoSource > 0) {
        regions[region][sources[order.order.customer_infoSource]].mosquitos++;
      }
    });
    callback(null);
  }).catch(function (err) {
    console.log(err);
  });
}
function getWindowsills(factoryId, callback) {
  models.order_addelements.findAll({
    include: [
      {model: models.orders,
        where: {
          factory_id: factoryId, sended: {$gt: new Date(0)},
          created: {$gt: startTime, $lt: stopTime}
        },
        include: [
          {model: models.cities, include: [{model: models.regions, attributes: ['name']}], attributes: ['id']},
          {model: models.users, attributes: ['name'], required: true}
        ],
        attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
      }, {
        model: models.lists, where: {list_group_id: {$in: [8, 9]}},
        include: {model: models.addition_folders, attributes: ['name']},
        attributes: ['list_group_id']
      }
    ],
    attributes: ['id']
  }).then(function(windowsills) {
    var i, region, windowsillType, types = [];
    async.map(windowsills, function (order, _callback) {
      var sex = order.order.customer_sex;
      var age = order.order.customer_age;
      var occup = order.order.customer_occupation;
      var info = order.order.customer_infoSource;
      region = order.order.city.region.name;
      windowsillType = order.list.addition_folder.name;
      if (order.list.list_group_id == 8) {
        addInnerData(region, 'windowsills', windowsillType, 'windowsillCount', sex, age, occup, info);
        if (fields.windowsills.indexOf(windowsillType) === -1) {
          fields.windowsills.push(windowsillType);
        }
      } else if (order.list.list_group_id == 9) { // отливы
        addInnerData(region, 'frontSills', windowsillType, 'frontSillsCount', sex, age, occup, info);
        if (fields.frontSills.indexOf(windowsillType) === -1) {
          fields.frontSills.push(windowsillType);
        }
      }
      _callback();
    }, function () {
      callback(null, types);
    });
  });
}

function firstFiveOfGlazing(obj, callback) {
  var i, key, tempMax = 0, countMax, sumMax = 0;
  for (i = 1; i < 6; i++) {
    for (key in obj) {
      if (fields.glazzing.indexOf(key) === -1) {
        if (tempMax < obj[key]) {
          tempMax = obj[key];
          countMax = key;
        }
      }
    }
    tempMax = 0;
    if (countMax) {
      fields.glazzing.push(countMax);
    }
  }
  callback(null);
}

function openTypes(data, callback) {
  models.window_hardware_types.findAll().then(function (hNames) {
    var hardwareName;
    async.map(data, function (data, _cb) {
      Object.keys(data.sash).forEach(function(key, item, keys) {
        hardwareName = hNames.find(function (el, index, arr) {
          if (el.id === +key) return true;
        }).name;
        addInnerData(data.region, 'hardwareTypes', hardwareName, 'hardwareTypesCount', data.sex, data.age, data.occup, data.info);
        if (fields.hardwareTypeInfo.indexOf(hardwareName) === -1) {
          fields.hardwareTypeInfo.push(hardwareName);
        }
      });
      _cb();
    }, function (err, result) {
      callback();
    });
  });
}

function addInnerData(region, fieldType, fieldName, countVar, sex, age, occup, info) {
  regions[region][fieldType][fieldName] = (regions[region][fieldType][fieldName] || 0) + 1;
  regions[region][countVar]++;
  if (sex > 0) {
    regions[region][sexes[sex]][fieldType][fieldName] =
    (regions[region][sexes[sex]][fieldType][fieldName] || 0) + 1;
    regions[region][sexes[sex]][countVar]++;
  }
  if (age > 0) {
    regions[region][ages[age]][fieldType][fieldName] =
    (regions[region][ages[age]][fieldType][fieldName] || 0) + 1;
    regions[region][ages[age]][countVar]++;
  }
  if (occup > 0) {
    regions[region][ocupations[occup]][fieldType][fieldName] =
    (regions[region][ocupations[occup]][fieldType][fieldName] || 0) + 1;
    regions[region][ocupations[occup]][countVar]++;
  }
  if (info > 0) {
    regions[region][sources[info]][fieldType][fieldName] =
    (regions[region][sources[info]][fieldType][fieldName] || 0) + 1;
    regions[region][sources[info]][countVar]++;
  }
}
