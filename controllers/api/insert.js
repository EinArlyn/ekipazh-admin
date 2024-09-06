var async = require('async');
var _  = require('lodash');

var models = require('../../lib/models');
var sendOrderEmail = require('../../lib/services/mailer').sendOrderEmail;
var exportOrder = require('../../lib/services/exportOrder');

var INDEX_T = 1;
/**
 * Insert new value to DB
 * @param {string}   login
 * @param {string}   access_token
 * @param {string}   model
 * @param {string}   row
 */
module.exports = function(req, res) {
  var login = req.query.login;
  var access_token = req.query.access_token;

  var model = req.body.model;
  var row = JSON.parse(req.body.row);

  models.users.find({
    where: {phone: login, device_code: access_token}
  }).then(function(user) {
    if (user) {
      models[model].create(row).then(function(result) {
        models[model].findOne({
          where: {id: result.id}
        }).then(function(newRow) {
          if (model === 'orders') {
            __setOrderPrices(newRow);
            __setOrderNumber(newRow, function(orderNumber) {
              res.send({status: true, order_number: orderNumber});
            });
          } else {
            res.send({status: true});
          }
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
        });
      }).catch(function(err) {
        console.log(err);
        res.send({status: false});
      });
    } else {
      res.send({status: false});
    }
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
};

/**
 * Set order number after inset
 * @param {object}  new order
 */
function __setOrderNumber(order, done) {
  models.orders.max('order_number', {
    where: {factory_id: order.factory_id}
  }).then(function(maxValue) {
    var newNumber;

    if (maxValue) {
      newNumber = parseInt(maxValue, 10) + 1;

      done(newNumber);
      order.updateAttributes({
        order_number: parseInt(newNumber, 10)
      });
    } else {
      newNumber = 1000000;

      done(newNumber);
      order.updateAttributes({
        order_number: parseInt(newNumber, 10)
      });
    }

    //exportOrder(orderRow.id);
    sendOrderEmail(order, newNumber);
  }).catch(function(err) {
    console.log(err);
  });
}

/*******************************************************************************
 * Set order prices
 */
function __setOrderPrices(orderRow) {
  var userId = orderRow.user_id;

  models.users.find({
    where: {
      id: userId
    }
  }).then(function(user) {
    models.users.find({
      where: {
        id: user.factory_id
      }
    }).then(function(factory) {
      var isPayer = false;

      /** Seller === payer? */
      if (user.is_payer || user.id === user.factory_id) {
        isPayer = true;
      }

      _setPrices(orderRow, user, factory, orderRow.order_price_dis, { id: userId, is_payer: isPayer, is_customer: true });

    }).catch(function(err) {
      console.log('__setOrderPrices', err);
    });
  }).catch(function(err) {
    console.log('__setOrderPrices', err);
  });
}

function _setPrices(orderRow, user, factory, childPurchase, seller) {
  models.users_discounts.find({
    where: {
      user_id: user.id
    }
  }).then(function(userDiscounts) {
    models.users_discounts.find({
      where: {
        user_id: seller.id
      }
    }).then(function(sellerDiscounts) {
      var userMarginPrice = 0.00;
      var constructDiscount = 0;
      var addElemDiscount = 0;
      // var userPurchasePrice = parseFloat(parseFloat(orderRow.order_price) - (parseFloat(orderRow.templates_price * (userDiscounts.max_construct / 100)) + parseFloat(orderRow.addelems_price * (userDiscounts.max_add_elem / 100)))).toFixed(2);
      var userPurchasePrice = (+orderRow.order_price) - ((+orderRow.templates_price - (+orderRow.templates_price / ((+userDiscounts.default_construct + 100) / 100))) + (+orderRow.addelems_price - (+orderRow.addelems_price / ((+userDiscounts.default_add_elem + 100) / 100)))).toFixed(2);

      var userBasePrice = parseFloat(orderRow.order_price).toFixed(2);
      var userSalePrice = parseFloat(childPurchase).toFixed(2);
      var userMountingPrice = 0.00;
      var userDeliveryPrice = 0.00;

      if(user.id !== seller.id) {
        userPurchasePrice = userSalePrice;
      }

      /** mouting */
      if (parseInt(orderRow.mounting_user_id, 10) === parseInt(user.id, 10) || parseInt(orderRow.mounting_user_id, 10) === parseInt(factory.id, 10)) {
        userMountingPrice = parseFloat(orderRow.mounting_price);
      }
      // delivery
      if (parseInt(orderRow.delivery_user_id, 10) === parseInt(user.id, 10) || parseInt(orderRow.delivery_user_id, 10) === parseInt(factory.id, 10)) {
        userDeliveryPrice = parseFloat(orderRow.floor_price);
      }

      /** Checks if mounting from factory */
      if (parseInt(orderRow.mounting_user_id, 10) === parseInt(factory.id, 10)) {
        console.log('mounting from factory +');
        console.log(parseFloat(userPurchasePrice).toFixed(2) + ' + ' + parseFloat(orderRow.mounting_price).toFixed(2) + ' = ' + (+parseFloat(userPurchasePrice).toFixed(2) + +parseFloat(orderRow.mounting_price).toFixed(2)));
        userPurchasePrice = +parseFloat(userPurchasePrice).toFixed(2) + +parseFloat(orderRow.mounting_price).toFixed(2);
      }

      /** Checks if delivery from factory */
      if (parseInt(orderRow.delivery_user_id, 10) === parseInt(factory.id, 10)) {
        console.log('delivery from factory +');
        console.log(parseFloat(userPurchasePrice).toFixed(2) + ' + ' + parseFloat(orderRow.floor_price).toFixed(2) + ' = ' + (+parseFloat(userPurchasePrice).toFixed(2) + +parseFloat(orderRow.floor_price).toFixed(2)));
        userPurchasePrice = +parseFloat(userPurchasePrice).toFixed(2) + +parseFloat(orderRow.floor_price).toFixed(2);
      }

      /** Discounts for order printout */
      if (seller.is_customer) {
        constructDiscount = +parseFloat(orderRow.discount_construct);
        addElemDiscount = +parseFloat(orderRow.discount_addelem);
      } else {
        constructDiscount = +parseFloat(sellerDiscounts.max_construct);
        addElemDiscount = +parseFloat(sellerDiscounts.max_add_elem);
      }

      userMarginPrice = (userSalePrice - userPurchasePrice).toFixed(2);

      if (parseInt(user.id, 10) !== parseInt(factory.id, 10)) {
        // userMarginPrice = (userMarginPrice - userMountingPrice - userDeliveryPrice).toFixed(2);
      }

      models.order_prices.create({
        order_id: orderRow.id,
        user_id: parseInt(user.id, 10),
        seller_id: parseInt(seller.id, 10),
        purchase_price: userPurchasePrice,
        margin_price: userMarginPrice,
        base_price: userBasePrice,
        sale_price: userSalePrice,
        mounting: userMountingPrice,
        delivery: userDeliveryPrice,
        is_own: 1,
        discount_construct: constructDiscount,
        discount_addelem: addElemDiscount
      }).then(function() {
        if (parseInt(user.id, 10) === parseInt(factory.id)) return; //__setParallelPrices(orderRow, user.id, seller.id, childPurchase, userDeliveryPrice, userMountingPrice, constructDiscount, addElemDiscount);

        models.users.find({
          where: {
            id: user.parent_id
          }
        }).then(function(parentUser) {
          var currentSeller = seller;
          /** PURCHASE? */
          var currentPurchase = userPurchasePrice;

          if (seller.is_payer && !seller.is_customer) {
            currentPurchase = childPurchase;
          } else {
            if (seller.is_customer) {
              currentSeller.is_customer = false;
            } else {
              var isPayer = false;

              /** Seller === payer? */
              if (parentUser.is_payer || parentUser.id === parentUser.factory_id) {
                isPayer = true;
              }

              currentSeller.id = parentUser.id;
              currentSeller.is_payer = isPayer;
            }
          }

          _setPrices(orderRow, parentUser, factory, currentPurchase, currentSeller);
        }).catch(function(err) {
          console.log(err);
        });
      }).catch(function(err) {
        console.log('__setPriceForFactory', err);
      });
    }).catch(function(err) {
      console.log('_setPrices', err);
    });
  }).catch(function(err) {
    console.log('_setPrices', err);
  });
}

function __setParallelPrices(orderRow, factoryId, sellerId, childPurchase, factoryDelivery, factoryMounting, constructDiscount, addElemDiscount) {
  models.order_prices.findAll({
    where: {
      order_id: orderRow.id
    },
    attributes: ['user_id']
  }).then(function(currentOrderUsers) {
    var usersIds = currentOrderUsers.map(function(orderUser) {
      return parseInt(orderUser.dataValues.user_id, 10);
    });

    async.waterfall([
      /** Get factory included users */
      function(_cb) {
        var includedUsersIds = [];
        incUsers(factoryId);

        function incUsers(userId) {
          return models.sequelize.query('SELECT users.id, users.parent_id ' +
              'FROM users ' +
              'WHERE users.parent_id = ' + userId +
          '').then(function(includedUsers) {
            if (includedUsers[0]) {
              for (var i = 0; i < includedUsers[0].length; i++) {
                includedUsersIds.push(includedUsers[0][i].id);
                includedUsers[0][i].includedUsers = incUsers(includedUsers[0][i].id);
              }
              return includedUsers[0];
            } else {
              return;
            }
          });
        }

        setTimeout(function() {
          _cb(null, includedUsersIds);
        }, 2000);
      },
      /** Set Prices for included users */
      function(includedUsersIds, _cb) {
        var diffUsers = _.difference(includedUsersIds, usersIds);

        async.each(diffUsers, __setPriceForParallel, function(err) {
          if (err) return _cb(err);
          _cb(null);
          console.log('Parallels prices - done.');
        });

        function __setPriceForParallel(userId, done) {
          models.users_discounts.find({
            where: {
              user_id: userId
            }
          }).then(function (userDiscounts) {
            var userPurchasePrice = parseFloat(parseFloat(orderRow.order_price) - (parseFloat(orderRow.templates_price * (userDiscounts.max_construct / 100)) + parseFloat(orderRow.addelems_price * (userDiscounts.max_add_elem / 100)))).toFixed(2) + +parseFloat(factoryDelivery).toFixed(2) + +parseFloat(factoryMounting).toFixed(2);
            var userBasePrice = parseFloat(orderRow.order_price).toFixed(2);
            var userSalePrice = parseFloat(childPurchase).toFixed(2);
            // TODO: zavod mounting/delivery
            var userMountingPrice = 0.00;
            var userDeliveryPrice = 0.00;
            var userMarginPrice = (userSalePrice - userPurchasePrice).toFixed(2);

            models.order_prices.create({
              order_id: orderRow.id,
              user_id: parseInt(userId, 10),
              seller_id: parseInt(sellerId, 10),
              purchase_price: userPurchasePrice,
              margin_price: userMarginPrice,
              base_price: userBasePrice,
              sale_price: userSalePrice,
              mounting: userMountingPrice,
              delivery: userDeliveryPrice,
              is_own: 0,
              discount_construct: constructDiscount,
              discount_addelem: addElemDiscount
            }).then(function() {
              done(null);
            }).catch(function(err) {
              done(err);
            });
          }).catch(done);
        }
      }
    ], function(err) {
      if (err) return console.log(err);
    });
  }).catch(function(err) {
    console.log('__setParallelPrices', err);
  });
}

/*
  _getUserIdRecursive(includedUsers);
  // var diffUsers = _.difference(includedUsers, );

  function _getUserIdRecursive(includedUsers) {
    includedUsers._rejectionHandler0.map(function(incUsrProm) {
      filteredUsersIds.push(incUsrProm.id);
      if (incUsrProm._rejectionHandler0 && incUsrProm._rejectionHandler0.length) return filteredUsersIds.push(_getUserIdRecursive(incUsrProm));
    });
  }
*/
