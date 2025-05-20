var models = require('../../lib/models');
var request = require('request');
var url = require('url');

module.exports = function (req, res) {
    var device_code = req.body.device_code;
    var callback_url = req.body.callback_url;

    if (!device_code || !callback_url) {
        return res.status(400).send({ status: false, message: 'Missing required fields', meta: { device_code: device_code, callback_url: callback_url } });
    }

    getUserByDeviceCode(device_code, function (err, user) {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send({ status: false, message: 'Internal server error', meta: { device_code: device_code, callback_url: callback_url } });
        }

        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found', meta: { device_code: device_code, callback_url: callback_url } });
        }

        var timestamp = Date.now();
        var data = { user_id: user.id, timestamp: timestamp };

        sendPostRequest(callback_url, data, function (err, response) {
            if (err) {
                console.error('Error sending POST request:', err);
                return res.status(500).send({ status: false, message: 'Failed to send callback request: ' + err.message, meta: { device_code: device_code, callback_url: callback_url } });
            }

            res.send({ status: true, message: 'Callback request sent successfully', response: response, meta: { device_code: device_code, callback_url: callback_url } });
        });
    });
};

function getUserByDeviceCode(device_code, callback) {
    models.users.findOne({
        where: { device_code: device_code },
        attributes: ['id']
    }).then(function (user) {
        callback(null, user);
    }).catch(function (err) {
        callback(err);
    });
}

function sendPostRequest(callback_url, data, callback) {
    request.post({
        url: callback_url,
        json: true,
        body: data,
        strictSSL: false,
        rejectUnauthorized: false
    }, function (err, httpResponse, body) {
        if (err) {
            return callback(new Error('Network error: ' + err.message));
        }

        if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
            callback(null, body);
        } else {
            callback(new Error('Request failed with status ' + httpResponse.statusCode + ': ' + JSON.stringify(body)));
        }
    });
}
