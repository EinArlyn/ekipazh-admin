var models = require('../../lib/models');

module.exports = function (req, res) {
    var token = req.body.token;

    if (!token) {
        return res.status(400).send({ status: false, message: 'Missing required fields', meta: { token: token } });
    }

    getTokenInfoByToken(token, function (err, tokenInfo) {
        if (err) {
            console.error('Error fetching token info:', err);
            return res.status(500).send({ status: false, message: 'Internal server error', meta: { token: token } });
        }

        if (!tokenInfo) {
            return res.status(404).send({ status: false, message: 'Token not found', meta: { token: token } });
        }

        var now = Date.now();
        var expiresAt = tokenInfo.expires_at;

        if (now > expiresAt) {
            return res.status(400).send({ status: false, message: 'Token has expired', meta: { token: token, expires_at: tokenInfo.expires_at } });
        }

        getUserById(tokenInfo.user_id, function (err, user) {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).send({ status: false, message: 'Internal server error', meta: { token: token } });
            }

            if (!user) {
                return res.status(404).send({ status: false, message: 'User not found', meta: { token: token } });
            }

            deleteToken(token, tokenInfo.user_id, function (err) {
                if (err) {
                    console.error('Error deleting token:', err);
                    return res.status(500).send({ status: false, message: 'Internal server error', meta: { token: token } });
                }

                res.send({ status: true, message: 'Token is valid', data: { user: user }, meta: { token: token } });
            });
        });
    });
};

function getTokenInfoByToken(token, callback) {
    models.one_time_tokens.findOne({
        where: { token: token },
        attributes: ['user_id', 'expires_at']
    }).then(function (tokenInfo) {
        callback(null, tokenInfo);
    }).catch(function (err) {
        callback(err);
    });
}

function getUserById(user_id, callback) {
    models.users.findOne({
        where: { id: user_id },
        attributes: [
            'id', 'email', 'password', 'short_id', 'factory_id', 'name', 'phone',
            'locked', 'user_type', 'city_phone', 'city_id', 'avatar', 'birthday',
            'sex', 'device_code', 'modified', 'address', 'last_sync',
            'code_sync', 'currencies_id'
        ]
    }).then(function (user) {
        callback(null, user);
    }).catch(function (err) {
        callback(err);
    });
}

function deleteToken(token, user_id, callback) {
    models.one_time_tokens.destroy({
        where: { token: token, user_id: user_id }
    }).then(function () {
        callback(null);
    }).catch(function (err) {
        callback(err);
    });
}
