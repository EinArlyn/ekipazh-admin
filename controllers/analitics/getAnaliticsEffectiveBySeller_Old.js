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

  var fileName = 'Эффективность работы по продавцам(' + req.params.from + ' - ' + req.params.to +').xlsx';
  factoryId = req.session.user.factory_id;
  getSellers(function (err, result) {
    // if (err) {
    //   return res.send({error: result});
    // }
    // async.series([
    //   getCosts,
    //   getCostsBySize,
    //   getCountWindows,
    //   getSendedOrdersCount,
    //   getTimeOfProcessing,
    //   getOrdersByDays
    // ], function (_err, _result) {
    //   if (_err || !_result) return res.send({error: _result});
      writeToExcell.writeToExcel(allData, true, fileName, function (err, result) {
        return res.send({file: fileName});
      });
    // });
  });
};

// ------------ functions -------------------------
function getSellers(callback) {
  console.time('getSellers')
  models.users.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, created: {$gt: startTime, $lt: stopTime}},
      include: {
        model: models.order_products,
        attributes: ['template_price', 'template_width', 'template_height']
      },
      attributes: ['customer_sex', 'customer_age', 'customer_occupation', 'customer_infoSource', 'modified', 'sended', 'order_price']
    }],
    attributes: ['id', 'name']
  }).then(function (users) {
    console.timeEnd('getSellers')
    async.map(users, function (user, _cb) {
      var countsInner = {};
      var countSendedOrders = 0;
      allData[user.id + '-' + user.name] = [];
      allData[user.id + '-' + user.name][19] = {};
      allData[user.id + '-' + user.name][1] = user.orders.reduce(function (sum, order) {
        var region = user.id + '-' + user.name;
        var sex = order.customer_sex;
        var age = order.customer_age;
        var occup = order.customer_occupation;
        var info = order.customer_infoSource;
        var day = order.modified.getDay();
        var hours = order.modified.getHours();
        var timeInDays = Math.ceil((order.sended - order.modified) / (1000 * 3600 * 24));
        if (new Date(order.sended) > new Date(0)) {
          allData[region][7] = (allData[region][7] || 0) + timeInDays;
          countSendedOrders ++;
        }
        if (sex > 0) {
          if (!allData[region][19][sexes[sex]]) allData[region][19][sexes[sex]] = [];
          if (!allData[region][19][sexes[sex]][1]) allData[region][19][sexes[sex]][1] = {sum: 0, count: 0};
          if (!allData[region][19][sexes[sex]][7]) allData[region][19][sexes[sex]][7] = {sum: 0, count: 0};
          if (!allData[region][19][sexes[sex]][4]) allData[region][19][sexes[sex]][4] = {sum: 0, count: 0};
          allData[region][19][sexes[sex]][1].sum += +order.order_price;
          allData[region][19][sexes[sex]][1].count ++;
          if (new Date(order.sended) > new Date(0)) allData[region][19][sexes[sex]][7].sum += +timeInDays;
          if (new Date(order.sended) > new Date(0)) allData[region][19][sexes[sex]][7].count ++;
          allData[region][19][sexes[sex]][4].sum += +order.order_products.length;
          allData[region][19][sexes[sex]][4].count ++;
        }
        if (age > 0) {
          if (!allData[region][19][ages[age]]) allData[region][19][ages[age]] = [];
          if (!allData[region][19][ages[age]][1]) allData[region][19][ages[age]][1] = {sum: 0, count: 0};
          if (!allData[region][19][ages[age]][7]) allData[region][19][ages[age]][7] = {sum: 0, count: 0};
          if (!allData[region][19][ages[age]][4]) allData[region][19][ages[age]][4] = {sum: 0, count: 0};
          allData[region][19][ages[age]][1].sum += +order.order_price;
          allData[region][19][ages[age]][1].count ++;
          if (new Date(order.sended) > new Date(0)) allData[region][19][ages[age]][7].sum += +timeInDays;
          if (new Date(order.sended) > new Date(0)) allData[region][19][ages[age]][7].count ++;
          allData[region][19][ages[age]][4].sum += +order.order_products.length;
          allData[region][19][ages[age]][4].count ++;
        }
        if (occup > 0) {
          if (!allData[region][19][ocupations[occup]]) allData[region][19][ocupations[occup]] = [];
          if (!allData[region][19][ocupations[occup]][1]) allData[region][19][ocupations[occup]][1] = {sum: 0, count: 0};
          if (!allData[region][19][ocupations[occup]][7]) allData[region][19][ocupations[occup]][7] = {sum: 0, count: 0};
          if (!allData[region][19][ocupations[occup]][4]) allData[region][19][ocupations[occup]][4] = {sum: 0, count: 0};
          allData[region][19][ocupations[occup]][1].sum += +order.order_price;
          allData[region][19][ocupations[occup]][1].count ++;
          if (new Date(order.sended) > new Date(0)) allData[region][19][ocupations[occup]][7].sum += +timeInDays;
          if (new Date(order.sended) > new Date(0)) allData[region][19][ocupations[occup]][7].count ++;
          allData[region][19][ocupations[occup]][4].sum += +order.order_products.length;
          allData[region][19][ocupations[occup]][4].count ++;
        }
        if (info > 0) {
          if (!allData[region][19][sources[info]]) allData[region][19][sources[info]] = [];
          if (!allData[region][19][sources[info]][1]) allData[region][19][sources[info]][1] = {sum: 0, count: 0};
          if (!allData[region][19][sources[info]][7]) allData[region][19][sources[info]][7] = {sum: 0, count: 0};
          if (!allData[region][19][sources[info]][4]) allData[region][19][sources[info]][4] = {sum: 0, count: 0};
          allData[region][19][sources[info]][1].sum += +order.order_price;
          allData[region][19][sources[info]][1].count ++;
          if (new Date(order.sended) > new Date(0)) allData[region][19][sources[info]][7].sum += +timeInDays;
          if (new Date(order.sended) > new Date(0)) allData[region][19][sources[info]][7].count ++;
          allData[region][19][sources[info]][4].sum += +order.order_products.length;
          allData[region][19][sources[info]][4].count ++;
        }
        allData[region][4] = (allData[region][4] || 0) + order.order_products.length / user.orders.length;  // --- get count windows
        order.order_products.reduce(function (sum, product) {
          // ---- get Costs by size
          var costBySize = product.template_price / (product.template_width * product.template_height) * 1000000;
          allData[region][3] = allData[region][3]? +allData[region][3] + costBySize: costBySize;
          allData[region][5] = allData[region][5]? allData[region][5] + 1: 1;
          if (sex > 0) {
            if (!allData[region][19][sexes[sex]]) allData[region][19][sexes[sex]] = [];
            allData[region][19][sexes[sex]][3] = (allData[region][19][sexes[sex]][3] || 0) + costBySize;
          }
          if (age > 0) {
            if (!allData[region][19][ages[age]]) allData[region][19][ages[age]] = [];
            allData[region][19][ages[age]][3] = (allData[region][19][ages[age]][3] || 0) + costBySize;
          }
          if (occup > 0) {
            if (!allData[region][19][ocupations[occup]]) allData[region][19][ocupations[occup]] = [];
            allData[region][19][ocupations[occup]][3] = (allData[region][19][ocupations[occup]][3] || 0) + costBySize;
          }
          if (info > 0) {
            if (!allData[region][19][sources[info]]) allData[region][19][sources[info]] = [];
            allData[region][19][sources[info]][3] = (allData[region][19][sources[info]][3] || 0) +  costBySize;
          }
          dataForInnerTable(region, sex, age, occup, info, 5);
          // --- get orders by days
          if (new Date(order.sended) > new Date(0)) {
            allData[region][6] = (allData[region][6] || 0) + 1; // --- sended orders
            dataForInnerTable(region, sex, age, occup, info, 6); // sended orders for inner table
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
          }
        }, 0);
        return sum + (+order.order_price);
      }, 0) / user.orders.length;
      _cb(null, {name: user.id + '-' + user.name, countSendedOrders: countSendedOrders});
    }, function (err, result) {
      if (err) {
        console.log(err, result);
      } else {
        for (var i = 0; i < result.length; i++) {
          allData[result[i].name][7] = (allData[result[i].name][7] || 0) / (result[i].countSendedOrders || 1);
        }
      }
      callback(null, users.length);
    });
  }).catch(function (err) {
    callback(err);
  });
}

// function getSellers(callback) {
//   console.time('getSellers')
//   models.users.findAll({
//     include: [{model: models.orders,
//       where: {factory_id: factoryId, created: {$gt: startTime, $lt: stopTime}},
//       attributes: []
//     }]
//   }).then(function (users) {
//     console.timeEnd('getSellers')
//     async.map(users, function (user, _cb) {
//       allData[user.name] = [];
//       allData[user.name][19] = {};
//       _cb();
//     }, function (err, result) {
//       callback(null, users.length);
//     });
//   }).catch(function (err) {
//     callback(err);
//   });
// }
function getCosts(callback) {
  console.time('getCosts')
  models.orders.findAll({
    where: {
      factory_id: factoryId,
      created: {$gt: startTime, $lt: stopTime}
    },
    include: {model: models.users, attributes: ['name'], required: true}
  }).then(function (orders) {
    console.timeEnd('getCosts')
    if (!orders.length) return callback(null);
    var counts = {}, costBySize = 0, countsInner = {};
    async.map(orders, function (order, _cb) {
      var region = order.user.name;
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
        callback(err, result);
      } else {
        callback(null);
      }
    });
  }).catch(function (err) {
    callback(err);
  });
}
function getCostsBySize(callback) {
  console.time('getCostsBySize')
  models.order_products.findAll({
    include: {model: models.orders,
      where: {
        factory_id: factoryId,
        created: {$gt: startTime, $lt: stopTime}
      },
      include: {model: models.users, attributes: ['name'], required: true}
    }
  }).then(function (products) {
    console.timeEnd('getCostsBySize')
    if (!products.length) return callback(null);
    var region, costBySize;
    async.map(products, function (product, _cb) {
      region = product.order.user.name;
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
      if (err) {
        callback(err, result);
      } else {
        callback(null);
      }
    });
  }).catch(function (err) {
    callback(err);
  });
}
function getCountWindows(callback) {
  console.time('getCountWindows')
  models.orders.findAll({
    where: {
      factory_id: factoryId,
      created: {$gt: startTime, $lt: stopTime}
    },
    include: [
      {model: models.order_products},
      {model: models.users, attributes: ['name'], required: true}
    ]
  }).then(function (orders) {
    console.timeEnd('getCountWindows')
    if (!orders.length) return callback(null);
    var region, orderCounts = {}, countsInner = {};
    async.map(orders, function (order, _cb) {
      var sex = order.customer_sex;
      var age = order.customer_age;
      var occup = order.customer_occupation;
      var info = order.customer_infoSource;
      region = order.user.name;
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
      if (err) {
        callback(err, result);
      } else {
        callback(null);
      }
    });
  }).catch(function (err) {
    callback(err);
  });
}
function getSendedOrdersCount(callback) {
  console.time('getSendedOrdersCount')
  models.order_products.findAll({
    include: {model: models.orders,
      where: {
        factory_id: factoryId,
        created: {$gt: startTime, $lt: stopTime},
        sended: {$gt: new Date(0)}
      },
      include: {model: models.users, attributes: ['name'], required: true}
    }
  }).then(function (sendedOrders) {
    console.timeEnd('getSendedOrdersCount')
    if (!sendedOrders.length) return callback(null);
    var region;
    async.map(sendedOrders, function (order, _cb) {
      region = order.order.user.name;
      allData[region][6] = allData[region][6]? +allData[region][6] + 1: 1;
      var sex = order.order.customer_sex;
      var age = order.order.customer_age;
      var occup = order.order.customer_occupation;
      var info = order.order.customer_infoSource;
      dataForInnerTable(region, sex, age, occup, info, 6);
      _cb();
    }, function (err, result) {
      if (err) {
        callback(err, result);
      } else {
        callback(null);
      }
    });
  }).catch(function (err) {
    callback(err);
  });
}

function getTimeOfProcessing(callback) {
  console.time('getTimeOfProcessing')
  models.orders.findAll({
    where: {
      factory_id: factoryId,
      created: {$gt: startTime, $lt: stopTime},
      sended: {$gt: new Date(0)}
    },
    include: {model: models.users, attributes: ['name'], required: true}
  }).then(function (orders) {
    console.timeEnd('getTimeOfProcessing')
    if (!orders.length) return callback(null);
    var timeInDays, region, orderCounts = {}, countsInner = {},
      sex, age, occup, info, day, hours;
    async.map(orders, function (order, _cb) {
      region = order.user.name;
      if (!countsInner[region]) countsInner[region] = {};
      timeInDays = Math.ceil((order.sended - order.modified) / (1000 * 3600 * 24));
      allData[region][7] = (allData[region][7] || 0) + timeInDays;
      orderCounts[region] = (orderCounts[region] || 0) + 1;
      sex = order.customer_sex;
      age = order.customer_age;
      occup = order.customer_occupation;
      info = order.customer_infoSource;
      if (sex > 0) {
        if (!allData[region][19][sexes[sex]]) allData[region][19][sexes[sex]] = [];
        allData[region][19][sexes[sex]][7] = (allData[region][19][sexes[sex]][7] || 0) + timeInDays;
        countsInner[region][sexes[sex]] = (countsInner[region][sexes[sex]] || 0) + 1;
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
      if (err) {
        callback(err, result);
      } else {
        callback(null);
      }
    });
  }).catch(function (err) {
    callback(err);
  });
}
function getOrdersByDays(callback) { //все сoзданные заказы
  console.time('getOrdersByDays')
  models.order_products.findAll({
    include: {model: models.orders,
      where: {
        factory_id: factoryId,
        created: {$gt: startTime, $lt: stopTime},
        sended: {$gt: new Date(0)}
      },
      include: {model: models.users, attributes: ['name'], required: true}
    }
  }).then(function (orders) {
    console.timeEnd('getOrdersByDays')
    if (!orders.length) return callback(null);
    var region, day, sex, age, occup, info;
    async.map(orders, function (order, _cb) {
      region = order.order.user.name;
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
      if (err) {
        callback(err, result);
      } else {
        callback(null);
      }
    });
  }).catch(function (err) {
    callback(err);
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
