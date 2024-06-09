var request = require('request');

var env = process.env.NODE_ENV || 'development';
var config = require('../../config.json');

module.exports = function (orderId, cb) {
  console.log('EXPORT ORDER ID:', orderId);


//  request(config[env].orderExportLink + orderId, function (error, res, body) {
  request({url: config[env].orderExportLink + orderId,agentOptions: {rejectUnauthorized: false}}, function (error, res, body) {
    if (error || res.statusCode !== 200) return cb(body);
    cb();
  });
};
