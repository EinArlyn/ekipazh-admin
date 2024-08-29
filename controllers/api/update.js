var models = require('../../lib/models');
var utcService = require('../../lib/services/timezone');

/**
 * Update DB attributes
 * @param {string}   login
 * @param {string}   access_token
 * @param {string}   model          This is model, where you will update attributes
 * @param {integer}  fieldId        This is id of current row
 * @param {object}   field          This is object, where property - current field name
                                      and value - the value that you want to update
 */
module.exports = function(req, res) {
  var login = req.query.login;
  var access_token = req.query.access_token;

  var model = req.body.model;
  var rowId = req.body.rowId;
  var field = JSON.parse(req.body.field);

  if (model === 'orders' && field.sended) {
    field.sended = utcService(new Date());
  }

  models.users.find({
    where: {phone: login, device_code: access_token}
  }).then(function(user) {
    if (!user) return res.send({ status: false, error: 'User does not exist' });
    // if (model === 'order_products' || model === 'order_addelements') {
    //   return _updateOrderProperties(model, rowId, field, function (error, status) {
    //     if (!error) return res.send({ status: true });
    //     res.send({ status: false, error: error });
    //   });
    // }

    models[model].find({
      where: {id: rowId}
    }).then(function(result) {
      result.updateAttributes(field)
        .then(function(r) {
          if (model === 'orders') {
            models.orders.findOne({
              where: {
                id: r.id
              }
            }).then(function (newRow) {
              updatePrices(newRow, user);
            });
          }

          res.send({status: true});
        })
        .catch(function(error) {
          console.dir(error);
          res.send({status: false, error: error});
        });
    });
  });
};

function updatePrices (orderRow, user) {
  models.order_prices.destroy({
    where: {
      order_id: orderRow.id
    }
  }).then(function () {
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

      _setPrices(orderRow, user, factory, orderRow.order_price_dis, { id: user.id, is_payer: isPayer, is_customer: true });
    }).catch(function (error) {
      console.log(error);
    });
  }).catch(function (error) {
    console.log(error);
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

function _updateOrderProperties (model, orderId, field, cb) {
  models[model].find({
    where: {
      order_id: orderId
    }
  }).then(function (orderProperty) {
    orderProperty.updateAttributes(field)
      .then(function () {
        cb(null, true);
      })
      .catch(function (error) {
        cb(error, false);
      });
  }).catch(function (error) {
    console.log(error);
    cb(error, false);
  });
}
