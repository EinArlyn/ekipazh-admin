var models = require('../../lib/models');
var async = require('async');
var writeToExcell = require('./writeEffectiveAnalitics');

var sexes = ['', 'mas', 'fem'];
var ages = ['', 'ageF20', 'ageF31', 'ageF41', 'ageF51', 'ageF61'];
var ocupations = ['', 'employee', 'householder', 'employeer', 'student', 'pensioner', 'unknown'];
var sources = ['', 'tv', 'internet', 'press', 'friends', 'advertising'];
var allData = {},
    factoryId, startTime, stopTime;

module.exports = function (req, res) {
  var from = req.params.from.split('.');
  var to = req.params.to.split('.');
  startTime = (!isNaN(from[1]))? new Date(from[2], from[1] - 1, from[0]): new Date(0);
  stopTime = (!isNaN(to[1]))? new Date(to[2], to[1] - 1, to[0], 24): new Date();
  var fileName = 'Эффективность работы по регионам(' + req.params.from + ' - ' + req.params.to +').xlsx';
  factoryId = req.session.user.factory_id;
  getRegions1(function (err, result) {
    // if (err) {
    //   return res.send({error:result});
    // }
    // async.parallel([
    //   getCosts,
    //   getCostsBySize,
    //   getCountWindows,
    //   getSendedOrdersCount,
    //   getTimeOfProcessing,
    //   getOrdersByDays
    // ], function (_err, _result, name) {
    //   if (_err || !_result) return res.send({error: _result});
      writeToExcell.writeToExcel(allData, false, fileName, function () {
        res.send({file:fileName});
      });
    // });
  });
};

function getRegions1(callback) {
  models.regions.findAll({
    include: {model: models.cities,
      include: {model: models.orders,
        where: {
          factory_id: factoryId,
          created: {$gt: startTime, $lt: stopTime}
        },
        include: {
          model: models.order_products,
          attributes: ['template_price', 'template_width', 'template_height']
        },
        attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource', 'sended', 'modified', 'order_price']
      },
      attributes: ['id']
    },
    attributes: ['name', 'id']
  }).then(function (regions) {
    var countsInner = {};
    async.map(regions, function (region, _cb) {
      allData[region.name] = [];
      allData[region.name][19] = {};
      var countOrders = 0;
      var countSendedOrders = 0;
      if (!countsInner[region.name]) countsInner[region.name] = {};
      region.cities.forEach(function (city, c_item, cities) {
        city.orders.forEach(function (order, o_item, orders) {
          var sex = order.customer_sex;
          var age = order.customer_age;
          var occup = order.customer_occupation;
          var info = order.customer_infoSource;
          var timeInDays = Math.ceil((order.sended - order.modified) / (1000 * 3600 * 24));
          var day = order.modified.getDay();
          var hours = order.modified.getHours();

          allData[region.name][1] = allData[region.name][1]? +allData[region.name][1] + (+order.order_price): order.order_price; // делить на количество ордеров(которое нам не известно)
          allData[region.name][4] = allData[region.name][4]? +allData[region.name][4] + order.order_products.length: order.order_products.length;
          countOrders ++;
          if (new Date(order.sended) > new Date(0)) {
            allData[region.name][7] = (allData[region.name][7] || 0) + timeInDays;
            countSendedOrders ++;
          }
          if (sex > 0) {
            if (!allData[region.name][19][sexes[sex]]) allData[region.name][19][sexes[sex]] = [];
            if (!allData[region.name][19][sexes[sex]][7]) allData[region.name][19][sexes[sex]][7] = {sum: 0, count: 0};
            allData[region.name][19][sexes[sex]][1] = (+allData[region.name][19][sexes[sex]][1] || 0) + (+order.order_price);
            allData[region.name][19][sexes[sex]][4] = (allData[region.name][19][sexes[sex]][4] || 0) + order.order_products.length;
            countsInner[region.name][sexes[sex]] = (+countsInner[region.name][sexes[sex]] || 0) + 1;
            if (new Date(order.sended) > new Date(0)) allData[region.name][19][sexes[sex]][7].sum += +timeInDays;
            if (new Date(order.sended) > new Date(0)) allData[region.name][19][sexes[sex]][7].count ++;
          }
          if (age > 0) {
            if (!allData[region.name][19][ages[age]]) allData[region.name][19][ages[age]] = [];
            if (!allData[region.name][19][ages[age]][7]) allData[region.name][19][ages[age]][7] = {sum: 0, count: 0};
            allData[region.name][19][ages[age]][1] = (+allData[region.name][19][ages[age]][1] || 0) + (+order.order_price);
            allData[region.name][19][ages[age]][4] = (allData[region.name][19][ages[age]][4] || 0) + order.order_products.length;
            countsInner[region.name][ages[age]] = (+countsInner[region.name][ages[age]] || 0) + 1;
            if (new Date(order.sended) > new Date(0)) allData[region.name][19][ages[age]][7].sum += +timeInDays;
            if (new Date(order.sended) > new Date(0)) allData[region.name][19][ages[age]][7].count ++;
          }
          if (occup > 0) {
            if (!allData[region.name][19][ocupations[occup]]) allData[region.name][19][ocupations[occup]] = [];
            if (!allData[region.name][19][ocupations[occup]][7]) allData[region.name][19][ocupations[occup]][7] = {sum: 0, count: 0};
            allData[region.name][19][ocupations[occup]][1] = (+allData[region.name][19][ocupations[occup]][1] || 0) + (+order.order_price);
            allData[region.name][19][ocupations[occup]][4] = (allData[region.name][19][ocupations[occup]][4] || 0) + order.order_products.length;
            countsInner[region.name][ocupations[occup]] = (+countsInner[region.name][ocupations[occup]] || 0) + 1;
            if (new Date(order.sended) > new Date(0)) allData[region.name][19][ocupations[occup]][7].sum += +timeInDays;
            if (new Date(order.sended) > new Date(0)) allData[region.name][19][ocupations[occup]][7].count ++;
          }
          if (info > 0) {
            if (!allData[region.name][19][sources[info]]) allData[region.name][19][sources[info]] = [];
            if (!allData[region.name][19][sources[info]][7]) allData[region.name][19][sources[info]][7] = {sum: 0, count: 0};
            allData[region.name][19][sources[info]][1] = (+allData[region.name][19][sources[info]][1] || 0) + (+order.order_price);
            allData[region.name][19][sources[info]][4] = (allData[region.name][19][sources[info]][4] || 0) + order.order_products.length;
            countsInner[region.name][sources[info]] = (+countsInner[region.name][sources[info]] || 0) + 1;
            if (new Date(order.sended) > new Date(0)) allData[region.name][19][sources[info]][7].sum += +timeInDays;
            if (new Date(order.sended) > new Date(0)) allData[region.name][19][sources[info]][7].count ++;
          }
          order.order_products.forEach(function (product, p_item, products) {
            var costBySize = product.template_price / (product.template_width * product.template_height) * 1000000;
            allData[region.name][3] = allData[region.name][3]? +allData[region.name][3] + costBySize: costBySize;
            allData[region.name][5] = (allData[region.name][5] || 0) + 1 ;
            if (sex > 0) {
              if (!allData[region.name][19][sexes[sex]]) allData[region.name][19][sexes[sex]] = [];
              allData[region.name][19][sexes[sex]][3] = (allData[region.name][19][sexes[sex]][3] || 0) + costBySize;
            }
            if (age > 0) {
              if (!allData[region.name][19][ages[age]]) allData[region.name][19][ages[age]] = [];
              allData[region.name][19][ages[age]][3] = (allData[region.name][19][ages[age]][3] || 0) + costBySize;
            }
            if (occup > 0) {
              if (!allData[region.name][19][ocupations[occup]]) allData[region.name][19][ocupations[occup]] = [];
              allData[region.name][19][ocupations[occup]][3] = (allData[region.name][19][ocupations[occup]][3] || 0) + costBySize;
            }
            if (info > 0) {
              if (!allData[region.name][19][sources[info]]) allData[region.name][19][sources[info]] = [];
              allData[region.name][19][sources[info]][3] = (allData[region.name][19][sources[info]][3] || 0) +  costBySize;
            }
            dataForInnerTable(region.name, sex, age, occup, info, 5);
            if (new Date(order.sended) > new Date(0)) {
              allData[region.name][6] = (allData[region.name][6] || 0) + 1; // products in sended orders
              dataForInnerTable(region.name, sex, age, occup, info, 6);
              if (day > 0) {
                allData[region.name][7 + day] = (allData[region.name][7 + day] || 0) + 1;
                dataForInnerTable(region.name, sex, age, occup, info, 7 + day);
              } else {
                allData[region.name][14] = (allData[region.name][14] || 0) + 1;
                dataForInnerTable(region.name, sex, age, occup, info, 14);
              }
              if (hours < 11) {
                allData[region.name][15] = (allData[region.name][15] || 0) + 1;
                dataForInnerTable(region.name, sex, age, occup, info, 15);
              } else if (hours < 15) {
                allData[region.name][16] = (allData[region.name][16] || 0) + 1;
                dataForInnerTable(region.name, sex, age, occup, info, 16);
              } else if (hours < 19) {
                allData[region.name][17] = (allData[region.name][17] || 0) + 1;
                dataForInnerTable(region.name, sex, age, occup, info, 17);
              } else {
                allData[region.name][18] = (allData[region.name][18] || 0) + 1;
                dataForInnerTable(region.name, sex, age, occup, info, 18);
              }
            }
          });
        });
      });
      _cb(null, {name: region.name, countOrders: countOrders, countSendedOrders: countSendedOrders, countsInner: countsInner});
    }, function (err, result) {
      if (err) console.log(err, result);
      for (var i = 0; i < result.length; i++) {
        allData[result[i].name][1] = allData[result[i].name][1] / result[i].countOrders;
        allData[result[i].name][4] = allData[result[i].name][4] / result[i].countOrders;
        allData[result[i].name][7] = allData[result[i].name][7] / result[i].countSendedOrders;
        for (var key2 in allData[result[i].name][19]) {
          if (result[i].countsInner[result[i].name]) {
            allData[result[i].name][19][key2][1] = allData[result[i].name][19][key2][1] / (result[i].countsInner[result[i].name][key2] || 1);
            allData[result[i].name][19][key2][4] = allData[result[i].name][19][key2][4] / (result[i].countsInner[result[i].name][key2] || 1);
          }
        }
      }
      callback(null, regions.length);
    });
  }).catch(function (err) {
    if (err) console.log(err);
    callback(true, err, 'getRegions');
  });
}

function getRegions(callback) {
  models.regions.findAll({
    include: {model: models.cities,
      include: {model: models.orders,
        where: {
          factory_id: factoryId,
          created: {$gt: startTime, $lt: stopTime}
        },
        include: {model: models.users, attributes: ['name'], required: true}
      }
    }
  }).then(function (regions) {
    async.map(regions, function (region, _cb) {
      allData[region.name] = [];
      allData[region.name][19] = {};
      _cb();
    }, function (err, result) {
      callback(null, regions.length);
    });
  }).catch(function (err) {
    callback(true, err, 'getRegions');
  });
}
function getCosts(callback) {
  models.orders.findAll({
    where: {
      factory_id: factoryId,
      created: {$gt: startTime, $lt: stopTime}
    },
    include: [
      {model: models.cities,
        include: {model: models.regions, attributes: ['id', 'name']},
          attributes: ['id']},
      {model: models.users, attributes: ['name'], required: true}
    ]
  }).then(function (orders) {
    var region, counts = {}, costBySize = 0, countsInner = {};
    if (orders.length) {
      async.map(orders, function (order, _cb) {
        region = order.city.region.name;
        var sex = order.customer_sex;
        var age = order.customer_age;
        var occup = order.customer_occupation;
        var info = order.customer_infoSource;
        if (!countsInner[region]) countsInner[region] = {};
        allData[region][1] = allData[region][1]? +allData[region][1] + (+order.order_price): order.order_price;
        counts[region] = counts[region]? counts[region] + 1: 1;
        if (sex > 0) {
          if (!allData[region][19][sexes[sex]]) allData[region][19][sexes[sex]] = [];
          allData[region][19][sexes[sex]][1] = (+allData[region][19][sexes[sex]][1] || 0) + (+order.order_price);
          countsInner[region][sexes[sex]] = (+countsInner[region][sexes[sex]] || 0) + 1;
        }
        if (age > 0) {
          if (!allData[region][19][ages[age]]) allData[region][19][ages[age]] = [];
          allData[region][19][ages[age]][1] = (+allData[region][19][ages[age]][1] || 0) + (+order.order_price);
          countsInner[region][ages[age]] = (+countsInner[region][ages[age]] || 0) + 1;
        }
        if (occup > 0) {
          if (!allData[region][19][ocupations[occup]]) allData[region][19][ocupations[occup]] = [];
          allData[region][19][ocupations[occup]][1] = (+allData[region][19][ocupations[occup]][1] || 0) + (+order.order_price);
          countsInner[region][ocupations[occup]] = (+countsInner[region][ocupations[occup]] || 0) + 1;
        }
        if (info > 0) {
          if (!allData[region][19][sources[info]]) allData[region][19][sources[info]] = [];
          allData[region][19][sources[info]][1] = (+allData[region][19][sources[info]][1] || 0) + (+order.order_price);
          countsInner[region][sources[info]] = (+countsInner[region][sources[info]] || 0) + 1;
        }
        _cb();
      }, function (err, result) {
        for (var key in allData) {
          allData[key][1] = allData[key][1] / counts[key];
          for (var key2 in allData[key][19]) {
            if (countsInner[key]) {
              allData[key][19][key2][1] = allData[key][19][key2][1] / (countsInner[key][key2] || 1);
            }
          }
        }
        if (err) {
          callback(err, result, 'getCosts');
        } else {
          callback(err, 'result', 'getCosts');
        }
      });
    } else {
      callback(null);
    }
  }).catch(function (err) {
    callback(true, err, 'getCosts');
  });
}
function getCostsBySize(callback) {
  models.order_products.findAll({
    include: {model: models.orders,
      where: {
        factory_id: factoryId,
        created: {$gt: startTime, $lt: stopTime}
      },
      include: [
        {model: models.cities, include: {model: models.regions}},
        {model: models.users, attributes: ['name'], required: true}
      ]
    }
  }).then(function (products) {
    if (!products.length) return callback(null);
    var region, costBySize;
    async.map(products, function (product, _cb) {
      region = product.order.city.region.name;
      costBySize = product.template_price / (product.template_width * product.template_height) * 1000000;
      allData[region][3] = allData[region][3]? +allData[region][3] + costBySize: costBySize;
      allData[region][5] = allData[region][5]? allData[region][5] + 1: 1;
      var sex = product.order.customer_sex;
      var age = product.order.customer_age;
      var occup = product.order.customer_occupation;
      var info = product.order.customer_infoSource;
      if (sex > 0) {
        if (!allData[region][19][sexes[sex]]) allData[region][19][sexes[sex]] = [];
        allData[region][19][sexes[sex]][3] = (allData[region][19][sexes[sex]][3] || 0) + costBySize;
        allData[region][19][sexes[sex]][5] = (allData[region][19][sexes[sex]][5] || 0) + 1;
      }
      if (age > 0) {
        if (!allData[region][19][ages[age]]) allData[region][19][ages[age]] = [];
        allData[region][19][ages[age]][3] = (allData[region][19][ages[age]][3] || 0) + costBySize;
        allData[region][19][ages[age]][5] = (allData[region][19][ages[age]][5] || 0) + 1;
      }
      if (occup > 0) {
        if (!allData[region][19][ocupations[occup]]) allData[region][19][ocupations[occup]] = [];
        allData[region][19][ocupations[occup]][3] = (allData[region][19][ocupations[occup]][3] || 0) + costBySize;
        allData[region][19][ocupations[occup]][5] = (allData[region][19][ocupations[occup]][5] || 0) + 1;
      }
      if (info > 0) {
        if (!allData[region][19][sources[info]]) allData[region][19][sources[info]] = [];
        allData[region][19][sources[info]][3] = (allData[region][19][sources[info]][3] || 0) +  costBySize;
        allData[region][19][sources[info]][5] = (allData[region][19][sources[info]][5] || 0) + 1;
      }
      _cb();
    }, function (err, result) {
      for (var key in allData) {
        allData[key][3] = allData[key][3] / allData[key][5];
        for (var key2 in allData[key][19]) {
          allData[key][19][key2][3] = allData[key][19][key2][3] / allData[key][19][key2][5];
        }
      }
      callback(err, result, 'getCostsBySize');
    });
  }).catch(function (err) {
    callback(true, err,'getCostsBySize');
  });
}
function getCountWindows(callback) {
  models.orders.findAll({
    where: {
      factory_id: factoryId,
      created: {$gt: startTime, $lt: stopTime}
    },
    include: [
      {model: models.cities, include: {model: models.regions}},
      {model: models.order_products},
      {model: models.users, attributes: ['name'], required: true}
    ]
  }).then(function (orders) {
    if (!orders.length) return callback(null);
    var region, orderCounts = {}, countsInner = {};
    async.map(orders, function (order, _cb) {
      region = order.city.region.name;
      var sex = order.customer_sex;
      var age = order.customer_age;
      var occup = order.customer_occupation;
      var info = order.customer_infoSource;
      if (!countsInner[region]) countsInner[region] = {};
      allData[region][4] = allData[region][4]? +allData[region][4] + order.order_products.length: order.order_products.length;
      orderCounts[region] = orderCounts[region]? +orderCounts[region] + 1: 1;
      if (sex > 0) {
        if (!allData[region][19][sexes[sex]]) allData[region][19][sexes[sex]] = [];
        allData[region][19][sexes[sex]][4] = (allData[region][19][sexes[sex]][4] || 0) + order.order_products.length;
        countsInner[region][sexes[sex]] = (countsInner[region][sexes[sex]] || 0) + 1;
      }
      if (age > 0) {
        if (!allData[region][19][ages[age]]) allData[region][19][ages[age]] = [];
        allData[region][19][ages[age]][4] = (allData[region][19][ages[age]][4] || 0) + order.order_products.length;
        countsInner[region][ages[age]] = (countsInner[region][ages[age]] || 0) + 1;
      }
      if (occup > 0) {
        if (!allData[region][19][ocupations[occup]]) allData[region][19][ocupations[occup]] = [];
        allData[region][19][ocupations[occup]][4] = (allData[region][19][ocupations[occup]][4] || 0) + order.order_products.length;
        countsInner[region][ocupations[occup]] = (countsInner[region][ocupations[occup]] || 0) + 1;
      }
      if (info > 0) {
        if (!allData[region][19][sources[info]]) allData[region][19][sources[info]] = [];
        allData[region][19][sources[info]][4] = (allData[region][19][sources[info]][4] || 0) + order.order_products.length;
        countsInner[region][sources[info]] = (countsInner[region][sources[info]] || 0) + 1;
      }
      _cb();
    }, function (err, result) {
      for (var key in allData) {
        allData[key][4] = allData[key][4] / orderCounts[key];
        for (var key2 in allData[key][19]) {
          if (countsInner[key]) {
            allData[key][19][key2][4] = allData[key][19][key2][4] / countsInner[key][key2];
          }
        }
      }
      callback(err, result, 'getCountWindows');
    });
  }).catch(function (err) {
    callback(true, err, 'getCountWindows');
  });
}
function getSendedOrdersCount(callback) {
  models.order_products.findAll({
    include: {model: models.orders,
      where: {
        factory_id: factoryId,
        created: {$gt: startTime, $lt: stopTime},
        sended: {$gt: new Date(0)}
      },
      include: [
        {model: models.cities, include: {model: models.regions}},
        {model: models.users, attributes: ['name'], required: true}
      ]
    }
  }).then(function (sendedOrders) {
    if (!sendedOrders.length) return callback(null);
    var region;
    async.map(sendedOrders, function (order, _cb) {
      region = order.order.city.region.name;
      allData[region][6] = allData[region][6]? +allData[region][6] + 1: 1;
      var sex = order.order.customer_sex;
      var age = order.order.customer_age;
      var occup = order.order.customer_occupation;
      var info = order.order.customer_infoSource;
      dataForInnerTable(region, sex, age, occup, info, 6);
      _cb();
    }, function (err, result) {
      callback(err, result, 'getSendedOrdersCount');
    });
  }).catch(function (err) {
    callback(true, err,'getSendedOrdersCount');
  });
}

function getTimeOfProcessing(callback) {
  models.orders.findAll({
    where: {
      factory_id: factoryId,
      created: {$gt: startTime, $lt: stopTime},
      sended: {$gt: new Date(0)}
    },
    include: [
      {model: models.cities, include: {model: models.regions}},
      {model: models.users, attributes: ['name'], required: true}
    ]
  }).then(function (orders) {
    if (!orders.length)
      return callback(null);
    var timeInDays, region, orderCounts = {}, countsInner = {};
    async.map(orders, function (order, _cb) {
      region = order.city.region.name;
      if (!countsInner[region]) countsInner[region] = {};
      timeInDays = Math.ceil((order.sended - order.modified) / (1000 * 3600 * 24));
      allData[region][7] = (allData[region][7] || 0) + timeInDays;
      orderCounts[region] = (orderCounts[region] || 0) + 1;
      var sex = order.customer_sex;
      var age = order.customer_age;
      var occup = order.customer_occupation;
      var info = order.customer_infoSource;
      if (sex > 0) {
        if (!allData[region][19][sexes[sex]]) {
          allData[region][19][sexes[sex]] = [];
          allData[region][19][sexes[sex]][7] = (allData[region][19][sexes[sex]][7] || 0) + timeInDays;
          countsInner[region][sexes[sex]] = (countsInner[region][sexes[sex]] || 0) + 1;
        } else {
          allData[region][19][sexes[sex]][7] = (allData[region][19][sexes[sex]][7] || 0) + timeInDays;
          countsInner[region][sexes[sex]] = (countsInner[region][sexes[sex]] || 0) + 1;
        }
      }
      if (age > 0) {
        if (!allData[region][19][ages[age]]) allData[region][19][ages[age]] = [];
        allData[region][19][ages[age]][7] = (allData[region][19][ages[age]][7] || 0) + timeInDays;
        countsInner[region][ages[age]] = (countsInner[region][ages[age]] || 0) + 1;
      }
      if (occup > 0) {
        if (!allData[region][19][ocupations[occup]]) allData[region][19][ocupations[occup]] = [];
        allData[region][19][ocupations[occup]][7] = (allData[region][19][ocupations[occup]][7] || 0) + timeInDays;
        countsInner[region][ocupations[occup]] = (countsInner[region][ocupations[occup]] || 0) + 1;
      }
      if (info > 0) {
        if (!allData[region][19][sources[info]]) allData[region][19][sources[info]] = [];
        allData[region][19][sources[info]][7] = (allData[region][19][sources[info]][7] || 0) + timeInDays;
        countsInner[region][sources[info]] = (countsInner[region][sources[info]] || 0) + 1;
      }
      _cb();
    }, function (err, result) {
      var key, key2;
      for (key in allData) {
        allData[key][7] = (allData[key][7] || 0) / (orderCounts[key] || 1);
        for (key2 in allData[key][19]) {
          if (countsInner[key]) {
            allData[key][19][key2][7] = (allData[key][19][key2][7] || 0) / (countsInner[key][key2] || 1);
          }
        }
      }
      callback(err, result, 'getTimeOfProcessing');
    });
  }).catch(function (err) {
    callback(true, err, 'getTimeOfProcessing');
  });
}
function getOrdersByDays(callback) { //все сoзданные заказы
  models.order_products.findAll({
    include: {model: models.orders,
      where: {
        factory_id: factoryId,
        created: {$gt: startTime, $lt: stopTime},
        sended: {$gt: new Date(0)}
      },
      include: [
        {model: models.cities, include: {model: models.regions}},
        {model: models.users, attributes: ['name'], required: true}
      ]
    }
  }).then(function (orders) {
    if (!orders.length) return callback(null);
    var region, day, sex, age, occup, info;
    async.map(orders, function (order, _cb) {
      region = order.order.city.region.name;
      day = order.order.modified.getDay();
      hours = order.order.modified.getHours();
      sex = order.order.customer_sex;
      age = order.order.customer_age;
      occup = order.order.customer_occupation;
      info = order.order.customer_infoSource;
      if (day > 0) {
        allData[region][7 + day] = (allData[region][7 + day] || 0) + 1;
        dataForInnerTable(region, sex, age, occup, info, 7 + day);
      } else {
        allData[region][14] = (allData[region][14] || 0) + 1;
        dataForInnerTable(region, sex, age, occup, info, 14);
      }
      if (hours < 11) {
        allData[region][15] = (allData[region][15] || 0) + 1;
        dataForInnerTable(region, sex, age, occup, info, 15);
      } else if (hours < 15) {
        allData[region][16] = (allData[region][16] || 0) + 1;
        dataForInnerTable(region, sex, age, occup, info, 16);
      } else if (hours < 19) {
        allData[region][17] = (allData[region][17] || 0) + 1;
        dataForInnerTable(region, sex, age, occup, info, 17);
      } else {
        allData[region][18] = (allData[region][18] || 0) + 1;
        dataForInnerTable(region, sex, age, occup, info, 18);
      }
      _cb();
    }, function (err, result) {
      callback(err, result, 'getOrdersByDays');
    });
  }).catch(function (err) {
    callback(true, err, 'getOrdersByDays');
  });
}

// -------------------- helper -------------------------
function dataForInnerTable(region, sex, age, occup, info, number) {
  if (sex > 0) {
    if (!allData[region][19][sexes[sex]]) allData[region][19][sexes[sex]] = [];
    allData[region][19][sexes[sex]][number] = (allData[region][19][sexes[sex]][number] || 0) + 1;
  }
  if (age > 0) {
    if (!allData[region][19][ages[age]]) allData[region][19][ages[age]] = [];
    allData[region][19][ages[age]][number] = (allData[region][19][ages[age]][number] || 0) + 1;
  }
  if (occup > 0) {
    if (!allData[region][19][ocupations[occup]]) allData[region][19][ocupations[occup]] = [];
    allData[region][19][ocupations[occup]][number] = (allData[region][19][ocupations[occup]][number] || 0) + 1;
  }
  if (info > 0) {
    if (!allData[region][19][sources[info]]) allData[region][19][sources[info]] = [];
    allData[region][19][sources[info]][number] = (allData[region][19][sources[info]][number] || 0) + 1;
  }
}
