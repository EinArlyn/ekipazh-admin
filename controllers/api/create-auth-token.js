const { message } = require('emailjs');
const models = require('../../lib/models');
const crypto = require('crypto');

module.exports = async function (req, res) {
    try {
        const { user_id, timestamp } = req.body;
        if (!user_id || !timestamp) {
            return res.status(400).send({ status: false, message: 'Missing required fields', meta: { user_id, timestamp } });
        }

        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found', meta: { user_id, timestamp } });
        }

        if (user.password_updated_at > timestamp) {
            return res.status(400).send({ status: false, message: 'Password has been updated since the last request', meta: { user_id, timestamp } });
        }

        const token = generateUrlSafeToken(user_id, user.password, user.device_code);
        const timestamps = generateTokenTimestamps();
        await saveTokenToDatabase(token, user_id, timestamps);

        res.send({ status: true, meta: { user_id, timestamp }, token, message: 'Token generated successfully' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send({ status: false, message: 'Internal server error', meta: { user_id, timestamp } });
    }
}

async function getUserById(user_id) {
    try {
        const user = await models.users.findOne({
            where: { id: user_id },
            attributes: ['id', 'password_updated_at', 'password', 'device_code']
        });

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

function generateUrlSafeToken(userId, password, deviceCode) {
    try {
        if (!userId || !password || !deviceCode) {
            throw new Error('Missing required parameters');
        }

        const token = crypto.createHash('sha1')
        .update(`userId:${userId};ts:${Date.now()};psw:${password};device_code:${deviceCode}`)
        .digest('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
}

function generateTokenTimestamps()
{
    const now = Date.now();
    return {
        createdAt: now,
        expiresAt: now + 3600 * 1000, // Token valid for 1 hour
    };
}

async function saveTokenToDatabase(token, userId, timestamps) {
    try {
        const oneTimeToken = await models.one_time_tokens.create({
            token,
            user_id: userId,
            created_at: new Date(timestamps.createdAt),
            expires_at: new Date(timestamps.expiresAt)
        });

        return oneTimeToken;
    } catch (error) {
        console.error('Error saving token to database:', error);
        throw error;
    }
}