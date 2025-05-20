var models = require('../../lib/models');
var crypto = require('crypto');

module.exports = function (req, res) {
    var user_id = req.body.user_id;
    var timestamp = req.body.timestamp;

    if (!user_id || !timestamp) {
        return res.status(400).send({ status: false, message: 'Missing required fields', meta: { user_id: user_id, timestamp: timestamp } });
    }

    getUserById(user_id, function (err, user) {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send({ status: false, message: 'Internal server error', meta: { user_id: user_id, timestamp: timestamp } });
        }

        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found', meta: { user_id: user_id, timestamp: timestamp } });
        }

        if (user.password_updated_at > timestamp) {
            return res.status(400).send({ status: false, message: 'Password has been updated since the last request', meta: { user_id: user_id, timestamp: timestamp } });
        }

        var token;
        try {
            token = generateUrlSafeToken(user.id, user.password, user.device_code);
        } catch (err) {
            console.error('Error generating token:', err);
            return res.status(500).send({ status: false, message: 'Token generation error', meta: { user_id: user_id, timestamp: timestamp } });
        }

        var timestamps = generateTokenTimestamps();

        saveTokenToDatabase(token, user_id, timestamps, function (err, result) {
            if (err) {
                console.error('Error saving token to database:', err);
                return res.status(500).send({ status: false, message: 'Internal server error', meta: { user_id: user_id, timestamp: timestamp } });
            }

            res.send({ status: true, meta: { user_id: user_id, timestamp: timestamp }, data: { token: token }, message: 'Token generated successfully' });
        });
    });
};

function getUserById(user_id, callback) {
    models.users.findOne({
        where: { id: user_id },
        attributes: ['id', 'password_updated_at', 'password', 'device_code']
    }).then(function (user) {
        callback(null, user);
    }).catch(function (err) {
        callback(err);
    });
}

function generateUrlSafeToken(userId, password, deviceCode) {
    if (!userId || !password || !deviceCode) {
        throw new Error('Missing required parameters');
    }

    var token = crypto.createHash('sha1')
        .update('userId:' + userId + ';ts:' + Date.now() + ';psw:' + password + ';device_code:' + deviceCode)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return token;
}

function generateTokenTimestamps() {
    var now = Date.now();
    return {
        createdAt: now,
        expiresAt: now + 3600 * 1000
    };
}

function saveTokenToDatabase(token, userId, timestamps, callback) {
    models.one_time_tokens.create({
        token: token,
        user_id: userId,
        created_at: timestamps.createdAt,
        expires_at: timestamps.expiresAt
    }).then(function (result) {
        callback(null, result);
    }).catch(function (err) {
        callback(err);
    });
}
