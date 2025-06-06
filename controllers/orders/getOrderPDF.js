var i18n = require('i18n');
var async = require('async');
var _ = require('lodash');

var models = require('../../lib/models');
var formContent = require('../../lib/services/PDFKit').formContent;

/**
 * Get order PDF by order and user Ids
 * @param {numeric} params.orderId
 * @param {integer} query.userId
 */
module.exports = function (req, res) {
  var orderId = req.params.id;
  var userId = req.query.userId;
  var lang = req.query.lang || 'ua';
  var additionalProductsIds = [];

  i18n.setLocale(lang);
  // document.cookie = "i18next=" + lang + ";path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT";
  res.cookie('i18next', lang, { maxAge: 900000, httpOnly: false, path: '/' });


  models.users.find({
    where: {
      id: userId
    },
    include: [{
      model: models.cities
    }]
  }).then(function (user) {
    var factory = user.factory_id;

    models.order_prices.find({
      where: {
        order_id: orderId,
        user_id: userId
      },
      include: [{
        model: models.orders,
        include: [{
          model: models.order_products,
          include: [{
            model: models.profile_systems, attributes: ['id', 'name'], required: false
          }, {
            model: models.window_hardware_groups, attributes: ['id', 'name'], required: false
          }, {
            model: models.doors_groups, attributes: ['id', 'name'], required: false
          }]
        }, {
          model: models.order_addelements
        }]
      }, {
        model: models.users,
        include: {
          model: models.cities
        }
      }]
    }).then(function (order) {
      order.order.order_products = order.order.order_products.sort(function (a, b) {
        return a.product_id - b.product_id;
      });

      models.users_discounts.find({
        where: {
          user_id: userId
        },
        attributes: ['max_construct', 'max_add_elem', 'default_construct', 'default_add_elem']
      }).then(function (userDiscounts) {
        // check if hardwares from door groups
        if (order.order.order_products.length) {
          additionalProductsIds = _.map(order.order.order_products.filter(function (product) {
            return product.is_addelem_only == 1;
          }), 'product_id');

          order.order.order_products = order.order.order_products.filter(function (product) {
              return product.is_addelem_only != 1;
          });

          async.each(order.order.order_products, function (product, __cb) {
            if (!product.dataValues.door_group_id) return __cb();

            models.doors_hardware_groups.find({
              where: {
                id: product.dataValues.hardware_id
              },
              attributes: ['id', 'name']
            }).then(function (hardwareGroup) {
              product.window_hardware_group = hardwareGroup;
              __cb();
            }).catch(__cb);
          }, function (error) {
            __formPDF();
          });
        } else {
          __formPDF();
        }

        function getUrlQr(bank, name, okpo, price, order_num) {
          const qrData = 
            'BCD\n' +
            '002\n' +
            '2\n' +
            'UCT\n\n' +
            `${name}\n` +
            `${bank}\n` +
            `UAH${price}\n` +
            `${okpo}\n\n\n` +
            `${order_num}\n`;

          var buffer = new Buffer(qrData, 'utf8');
          var base64 = buffer.toString('base64');
          var base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          var url = `https://bank.gov.ua/qr/${base64url}`
            
          return url;
        }

        function __formPDF () {
          formContent(order, factory, userDiscounts, userId ,additionalProductsIds, function (result) {
            models.currencies.find({
              where: {
                factory_id: factory, is_base: 1
              },
              attributes: ['name']
            }).then(function (currency) {
              models.currencies.findAll({
                where: {
                  factory_id: factory, 
                  id: user.currencies_id
                }
              }).then(userInfo=>{
                if(userInfo[0].id === 102) {
                  currency.name = '₴';
                  order.sale_price = order.sale_price;
                }
                if(userInfo[0].id === 685) {
                  currency.name = '$';
                  order.sale_price = order.sale_price/userInfo[0].value;
                }
                if(userInfo[0].id === 684) {
                  currency.name = '€';
                  order.sale_price = order.sale_price/userInfo[0].value;
                }              
              
              // console.log('should render with result:', result);
              var addServicePrice;
              if(+userId !== +order.dataValues.seller_id) {
                addServicePrice = 0.00;
              } else {
                addServicePrice = order.order.sale_price;
              }

              var url = getUrlQr(user.bank_acc_no, user.legal_name, user.okpo, order.sale_price, order.order.order_hz);
              
              res.render('orderPDF', {
                i18n: i18n,
                user: user,
                order: order.order,
                products: result.content,
                count: result.constructCounter,
                square: result.square,
                basePrice: result.basePrice,
                basePriceDisc: result.basePriceDisc,
                additionalPrice: result.additionalPrice,
                additionalPriceDisc: result.additionalPriceDisc,
                maxConstructDisc: order.discount_construct,
                maxAddElemDisc: order.discount_addelem,
                perimeter: result.perimeter,
                currency: currency.name,
                delivery: order.delivery,
                mounting: order.mounting,
                addServicePrice: addServicePrice,
                total: order.sale_price,
                lang: lang
              });
            });}).catch(function (err) {
              console.log(err);
              res.send('Internal server error');
            });
          });
        }
      }).catch(function (err) {
        console.log(err);
        res.send({ status: false });
      });
    }).catch(function (err) {
      console.log(err);
      res.send('Internal server error');
    });
  }).catch(function (err) {
    console.log(err);
    res.send('Internal server error');
  });
}
