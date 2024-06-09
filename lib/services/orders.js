var request = require('request');
var env = process.env.NODE_ENV || 'development';
var exportLink = require('../../config.json')[env].exportOrderHZLink;

exports.validateExportFolder = function (order_hz, cb) {
  request({url: exportLink + 'S_' + order_hz + '.xls',agentOptions: {rejectUnauthorized: false}}, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      return cb(null, {
        ACC_PRICE_LINK: exportLink + 'S_' + order_hz + '.xls',
        SPEC_LINK: exportLink + 'Z_' + order_hz + '.xls'
      });
    }

    cb(null, {
      ACC_PRICE_LINK: exportLink + 'S_' + order_hz + '.xls',
      SPEC_LINK: null
    });
  });
};
