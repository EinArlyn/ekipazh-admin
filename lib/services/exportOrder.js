var request = require('request');

var config = require('../config');

module.exports = function (orderId, cb) {
  console.log('EXPORT ORDER ID:', orderId);


//  request(config.orderExportLink + orderId, function (error, res, body) {
  request({url: config.orderExportLink + orderId,agentOptions: {rejectUnauthorized: false}}, function (error, res, body) {
    if (error || res.statusCode !== 200) {return cb(body);}
    cb();
  });
};
