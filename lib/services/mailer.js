var models = require('../models');
var md5 = require('md5');
var generatePassword = require('password-generator');
var email = require('emailjs');
var config = require('../../config.json');
var env = process.env.NODE_ENV || 'development';

/**
 * Set main transporter(sender)
 */
var transporter ={};

transporter.sendMail = function (mailOptions, resultHandler) {
  var server  = email.server.connect({
    user: config[env].transporterMail,
    password: config[env].transporterPassword,
    host: config[env].transporterHost,
    ssl: config[env].transporterSSL || false
  });

  server.send({
   text:    mailOptions.html || mailOptions.text,
   from:    mailOptions.from,
   to:      mailOptions.to,
   subject: mailOptions.subject
  }, resultHandler);
};

exports.sendMail = transporter.sendMail;
exports.sendActivationEmail = sendActivationEmail;
exports.sendOrderEmail = sendOrderEmail;

function sendActivationEmail(recipient) {
  var newPassword = generatePassword(12, false);

  models.users.findOne({
    where: { email: recipient }
  }).then(function(user) {
    var mailOptions = {
      from: config[env].mailFrom,
      to: recipient,
      subject: 'Активация аккаунта',
      text: 'Регистрация аккаунта ' + recipient + ' завершена.' +
        ' Пароль входа в приложение: ' + newPassword + '.' +
        ' Пожалуйста, перейдите по ссылке: ' +
        config[env].activationURL + user.device_code +
        ' для активации аккаунта.'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      //user.updateAttributes({
      //  password: md5(newPassword)
      //});
      console.log('Message sent: ' + info.response);
    });
  }).catch(function(err) {
    console.log(err);
  });
}

function sendOrderEmail(order, newNumber) {
  console.log('NEW EMAIL');
  console.log('order:', order);

  var userId = order.user_id;
  var customerEmail = order.customer_email;
  var orderNumber = newNumber;
  var orderDate = ("0" + order.order_date.getDate()).slice(-2) + '.' + ("0" + (order.order_date.getMonth() + 1)).slice(-2) + '.' + order.order_date.getFullYear();
  var orderTime = ("0" + order.order_date.getHours()).slice(-2) + ':' + ("0" + order.order_date.getMinutes()).slice(-2);
  var customer = order.customer_name;
  var price = order.order_price_dis;

  models.users.find({
    where: {id: userId}
  }).then(function(user) {
    models.factory_emails.findAll({
      where: {factory_id: user.factory_id}
    }).then(function(factoryEmails) {
      var userEmail = user.email;
      var sellerName = user.name;

      var sellerMailOption = {
        from: config[env].mailFrom,
        to: userEmail,
        subject: 'Making an order / Оформлення замовлення ',
        text: 'Order No.' + orderNumber + ' created. Order date: ' + orderDate + ' ' + orderTime +
          '. Customer: ' + customer + '. Order cost: ' +  price + '\n' +
          '. Link to specification: ' + config[env].specLink + order.id +
          '?userId=' + user.id + '\n' + '--------------------------' + '\n' + 'Замовлення №' + orderNumber + ' створене. Дата оформлення: ' + orderDate + ' ' + orderTime +
          '. Покупець: ' + customer + '. Вартість замовлення: ' +  price + '\n' +
          '. Посилання на специфікацію: ' + config[env].specLink + order.id +
          '?userId=' + user.id
        //html: '<b>Hello world ✔</b>'
      };

      if  (user.factory_id == '24566')
      {
        var customerMailOption = {
          from: 'Okoshko <wc@windowscalculator.net>',
          to: customerEmail,
          subject: 'Оформление заказа',
          text: 'Заказ №' + orderNumber + ' создан. Дата оформления: ' + orderDate + ' ' + orderTime +
            '. Продавец: ' + sellerName + '. Стоимость заказа: ' +  price + '\n' +
            '. Cсылка на спецификацию: https://okoshko.ua/orders/?orderId=' + order.id + '&userId=' + user.id
          //html: '<b>Hello world ✔</b>'
        };
        console.log('sellerMailOption', sellerMailOption);
        console.log('customerMailOption', customerMailOption);
        transporter.sendMail(sellerMailOption, function(error, info) {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });

        transporter.sendMail(customerMailOption, function(error, info) {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });

        for (var k = 0; k < factoryEmails.length; k++) {
          transporter.sendMail({
            from: 'Okoshko <wc@windowscalculator.net>',
            to: factoryEmails[k].email,
            subject: 'Оформление заказа',
            text: 'Заказ №' + orderNumber + ' создан. Дата оформления: ' + orderDate + ' ' + orderTime +
              '. Продавец: ' + sellerName + '. Стоимость заказа: ' +  price + '\n' +
              '. Cсылка на спецификацию: https://okoshko.ua/orders/?orderId=' + order.id + '&userId=' + user.id
            //html: '<b>Hello world ✔</b>'
          }, function(error, info) {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: ' + info.response);
          });
        }
      }	
      else
      {
        var customerMailOption = {
          // from: config[env].mailFrom,
          from: 'test',
          to: customerEmail,
          subject: 'Making an order / Оформлення замовлення',
          text: 'Order No.' + orderNumber + ' created. Order date: ' + orderDate + ' ' + orderTime +
            '. Seller: ' + sellerName + '. Order cost: ' +  price + '\n' +
            '. Link to specification: ' + config[env].specLink + order.id +
            '?userId=' + user.id + '\n' + '--------------------------' + '\n' + 'Замовлення №' + orderNumber + ' створене. Дата оформлення: ' + orderDate + ' ' + orderTime +
            '. Продавець: ' + sellerName + '. Вартість замовлення: ' +  price + '\n' +
            '. Посилання на специфікацію: ' + config[env].specLink + order.id +
            '?userId=' + user.id,
          html: '<b>Hello world ✔</b>'
        };
        console.log('sellerMailOption', sellerMailOption);
        console.log('customerMailOption', customerMailOption);
        transporter.sendMail(sellerMailOption, function(error, info) {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });

        transporter.sendMail(customerMailOption, function(error, info) {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });

        for (var k = 0; k < factoryEmails.length; k++) {
          transporter.sendMail({
            from: config[env].mailFrom,
            to: factoryEmails[k].email,
            subject: 'Making an order / Оформлення замовлення',
            text: 'Order No.' + orderNumber + ' created. Order date: ' + orderDate + ' ' + orderTime +
              '. Seller: ' + sellerName + '. Order cost: ' +  price + '\n' +
              '. Link to specification: ' + config[env].specLink + order.id +
              '?userId=' + user.id + '\n' + '--------------------------' + '\n' + 'Замовлення №' + orderNumber + ' створене. Дата оформлення: ' + orderDate + ' ' + orderTime +
              '. Продавець: ' + sellerName + '. Вартість замовлення: ' +  price + '\n' +
              '. Посилання на специфікацію: ' + config[env].specLink + order.id +
              '?userId=' + user.id
            //html: '<b>Hello world ✔</b>'
          }, function(error, info) {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: ' + info.response);
          });
        }
      }

    });
  }).catch(function(err) {
    console.log(err);
  });
}
