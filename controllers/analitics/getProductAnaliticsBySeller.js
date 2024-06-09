var models = require('../../lib/models');
var async = require('async');
var writeToExcell = require('./writeProductAnalitics');

var startTime, stopTime, regions;
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
  var fileName = 'Продукт по продавцам(' + req.params.from + ' - ' + req.params.to +').xlsx';
  var factory_id = req.session.user.factory_id;//897;//940;
  var timeStart = '';
  getRegions(factory_id, function (err, regionsData) {
    if (!Object.keys(regionsData).length) return res.send({error: 'Нет данных по этому запросу'});
    regions = regionsData;
    getProfileSystemsInformation (factory_id, function (err, result) {
      console.log('1')
      getHardwareInformation(factory_id, function (err, result) {
        console.log('2')
        getOpenTypesInfo(factory_id, function (err, result) {
          console.log('3')
          openTypes(result, function (err, result) {
            getGlazingInfo(factory_id, function (err, result) {
              console.log('4')
              firstFiveOfGlazing(result, function (err, result) {
                console.log('5')
                getApertures(factory_id, function (err, result) {
                  console.log('6')
                  getMosquitos(factory_id, function (err, result) {
                    console.log('7')
                    getWindowsills(factory_id, function (err, result) {
                      console.log('8')
                      getFrontSills(factory_id, function (err, result) {
                        console.log('9')
                        writeToExcell.writeToExcel(regions, fields, fileName, true, function (err, result) {
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
        include: {model: models.users, attributes: ['id','name'], required: true},
        attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['profile_id', 'order_products.id']
  }).then(function (orders) {
    if (orders) {
      var i, region, prSystem, types = [], sex, age, occup, info;
      async.map(orders, function (order, callback) {
        sex = order.order.customer_sex;
        age = order.order.customer_age;
        occup = order.order.customer_occupation;
        info = order.order.customer_infoSource;
        region = order.order.user.id + '-' + order.order.user.name;
        prSystem = order.profile_system.name;
        addInnerData(region, 'profiles', prSystem, 'profileCount', sex, age, occup, info);
        if (fields.profileCount.indexOf(prSystem) === -1) {
          fields.profileCount.push(prSystem);
        }
        callback(null);
      }, function (err, result) {
        if (err) {
          callback(true, result);
        } else {
          callback(null, types);
        }
      });
    }
  });
}

function getRegions(factoryId, callback) {
  var regions = {};
  models.users.findAll({
    include: [{model: models.orders,
      where: {
        factory_id: factoryId,
        created: {$gt: startTime, $lt: stopTime},
        sended: {$gt: new Date(0)}
      },
      attributes: []
    }],
    attributes: ['id', 'name']
  }).then(function (users) {
    var innerFields = sexes.slice(1)
    .concat(ages.slice(1))
    .concat(ocupations.slice(1))
    .concat(sources.slice(1));
    for (var i = 0; i < users.length; i++) {
      regions[users[i].id + '-' + users[i].name] = {
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
        regions[users[i].id + '-' + users[i].name][innerFields[j]] = {
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
          created: {$gt: startTime, $lt: stopTime}
        },
        include: {model: models.users, attributes: ['id', 'name'], required: true},
        attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['hardware_id', 'order_products.id']
  }).then(function (orders) {
    if (orders) {
      var i, region, hName, types = [], sex, age, occup, info;
      async.map(orders, function (order, callback) {
        sex = order.order.customer_sex;
        age = order.order.customer_age;
        region = order.order.user.id + '-' + order.order.user.name;
        occup = order.order.customer_occupation;
        info = order.order.customer_infoSource;
        hName = order.window_hardware_group.name;
        addInnerData(region, 'hardwares', hName, 'hardwareCount', sex, age, occup, info);
        if (fields.hardwareInfo.indexOf(hName) === -1) {
          fields.hardwareInfo.push(hName);
        }
        callback(null);
      }, function (err, result) {
        if (err) {
          callback(true, result);
        } else {
          callback(null, types);
        }
      });
    } else {
      callback(null);
    }
  });
}

function getOpenTypesInfo(factoryId, callback) {
  models.order_products.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}
      },
      include: {model: models.users, attributes: ['id', 'name'], required: true},
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    where: {template_source: {$notIn: ['', '{}']}},
    attributes: ['template_source']
  }).then(function (orders) {
    var region;
    async.map(orders, function (order, _callback) {
      var sashTypes = {}, sex, age, occup, info;
      var orderDetails;
      try {
        orderDetails = JSON.parse(order.template_source);
        sex = order.order.customer_sex;
        age = order.order.customer_age;
        occup = order.order.customer_occupation;
        info = order.order.customer_infoSource;
        region = order.order.user.id + '-' + order.order.user.name;
        if (orderDetails.details) {
          orderDetails.details.map(function (details) {
            if (details.sashType) {
              sashTypes[details.sashType] = sashTypes[details.sashType]? (+sashTypes[details.sashType]) + 1: 1;
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
      _callback(null, {region:region, sash: sashTypes, sex: sex, age: age, occup: occup, info: info});
    }, function (err, result) {
      callback(null, result);
    });
  }).catch(function (err) {
    console.log(err);
  });
}

function getGlazingInfo(factoryId, callback) {
  models.order_products.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}
      },
      include: {model: models.users, attributes: ['id', 'name'], required: true},
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    where: {glass_id: {$ne: ''}},
    attributes: ['glass_id']
  }).then(function (glassIds) {
    var i, ids = [], tempId;
    for (i = 0; i < glassIds.length; i++) {
      tempId = glassIds[i].glass_id.split(', ');
      for (var j = 0; j < tempId.length; j++) {
        if (!isNaN(parseInt(tempId[j]))) {
          ids.push(parseInt(tempId[j]));
        }
      }
    }
    models.elements.findAll({
      include: [{model:models.lists,
        where: {id: {in: ids}},
        attributes: ['id']
      }],
      attributes: ['sku']
    }).then(function (elements) {
      var i, j, gl, glazingData = {};
      for (i = 0; i < elements.length; i++) {
        glazingData[elements[i].sku] = 0;
        for (j = 0; j < ids.length; j++) {
          for (k = 0; k < elements[i].lists.length; k++) {
            if (ids[j] == elements[i].lists[k].id) {
              glazingData[elements[i].sku]++;
            }
          }
        }
      }
      var array, ar, region, sex, age, occup, info;
      for (gl = 0; gl < glassIds.length; gl++) {
        for (i = 0; i < elements.length; i++) {
          for (k = 0; k < elements[i].lists.length; k++) {
            array = glassIds[gl].glass_id.split(', ');
            for (ar = 0; ar < array.length; ar++) {
              if (array[ar] == elements[i].lists[k].id) {
                sex = glassIds[gl].order.customer_sex;
                age = glassIds[gl].order.customer_age;
                occup = glassIds[gl].order.customer_occupation;
                info = glassIds[gl].order.customer_infoSource;
                region = glassIds[gl].order.user.id + '-' + glassIds[gl].order.user.name;
                addInnerData(region, 'glazingTypes', elements[i].sku, 'glazingCount', sex, age, occup, info);
              }
            }
          }
        }
      }
      callback(null, glazingData);
    });
  });
}
function getApertures(factoryId, callback) {
  console.time('getApertures')
  models.order_products.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}
      },
      include: {model: models.users, attributes: ['id', 'name'], required: true},
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    where: {template_source: {$notIn: ['', '{}']}},
    attributes: ['template_source']
  }).then(function (apertures) {
    console.timeEnd('getApertures')
    async.map(apertures, function(app, _cb) {
      var details, region;
      try {
        details = JSON.parse(app.template_source).details;
        if (details) {
          for (j = 0; j < details.length; j++) {
            if (details[j].children.length) {
              region = app.order.user.id + '-' + app.order.user.name;
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
          }
        }
      } catch (err) {
        console.log(err);
        _cb();
      }
      _cb();
    }, function (err, result) {
      callback(null, regions);
    });
  }).catch(function (err) {
    console.log(err);
  });
}
function getMosquitos(factoryId, callback) {
  models.order_addelements.findAll({
    where: {element_type: 0},
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}
      },
      include: {model: models.users, attributes: ['id', 'name'], required: true},
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }],
    attributes: ['id']
  }).then(function (mosquitos) {
    var i, region;
    for (i = 0; i < mosquitos.length; i++) {
      region = mosquitos[i].order.user.id + '-' + mosquitos[i].order.user.name;
      regions[region].mosquitos++;
      if (mosquitos[i].order.customer_sex > 0) {
        regions[region][sexes[mosquitos[i].order.customer_sex]].mosquitos++;
      }
      if (mosquitos[i].order.customer_age > 0) {
        regions[region][ages[mosquitos[i].order.customer_age]].mosquitos++;
      }
      if (mosquitos[i].order.customer_occupation > 0) {
        regions[region][ocupations[mosquitos[i].order.customer_occupation]].mosquitos++;
      }
      if (mosquitos[i].order.customer_infoSource > 0) {
        regions[region][sources[mosquitos[i].order.customer_infoSource]].mosquitos++;
      }
    }
    callback(null);
  });
}
function getWindowsills(factoryId, callback) {
  models.order_addelements.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}
      },
      include: {model: models.users, attributes: ['id', 'name'], required: true},
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }, {
      model: models.lists,
      where: {list_group_id: 8},
      include: {model: models.addition_folders, attributes: ['name']},
      attributes: ['id']
    }],
    attributes: ['id']
  }).then(function(windowsills) {
    var i, region, windowsillType, types = [], sex, age, occup, info;
    async.map(windowsills, function (sill, callback) {
      sex = sill.order.customer_sex;
      age = sill.order.customer_age;
      occup = sill.order.customer_occupation;
      info = sill.order.customer_infoSource;
      region = sill.order.user.id + '-' + sill.order.user.name;
      windowsillType = sill.list.addition_folder.name;
      addInnerData(region, 'windowsills', windowsillType, 'windowsillCount', sex, age, occup, info);
      if (fields.windowsills.indexOf(windowsillType) === -1) {
        fields.windowsills.push(windowsillType);
      }
      callback(null);
    }, function (err, result) {
      if (err) {
        callback(true, result);
      } else {
        callback(null, types);
      }
    });
  });
}

function getFrontSills(factoryId, callback) {
  models.order_addelements.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, sended: {$gt: new Date(0)},
        created: {$gt: startTime, $lt: stopTime}
      },
      include: {model: models.users, attributes: ['id', 'name'], required: true},
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource']
    }, {
      model: models.lists,
      where: {list_group_id: 9},
      include: {model: models.addition_folders, attributes: ['name']},
      attributes: ['id']
    }],
    attributes: ['id']
  }).then(function(sills) {
    var i, region, sillType, types = [], sex, age, occup, info;
    async.map(sills, function (sill, callback) {
      sex = sill.order.customer_sex;
      age = sill.order.customer_age;
      occup = sill.order.customer_occupation;
      info = sill.order.customer_infoSource;
      region = sill.order.user.id + '-' + sill.order.user.name;
      sillType = sill.list.addition_folder.name;
      addInnerData(region, 'frontSills', sillType, 'frontSillsCount', sex, age, occup, info);
      if (fields.frontSills.indexOf(sillType) === -1) {
        fields.frontSills.push(sillType);
      }
      callback(null);
    }, function (err, result) {
      if (err) {
        callback(true, result);
      } else {
        callback(null, types);
      }
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
