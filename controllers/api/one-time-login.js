const models = require('../../lib/models');

module.exports = async function (req, res) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).send({ status: false, message: 'Missing required fields', meta: { token } });
        }

        const tokenInfo = await getTokenInfoByToken(token);
        if (!tokenInfo) {
            return res.status(404).send({ status: false, message: 'Token not found', meta: { token } });
        }

        const now = Date.now();
        const expiresAt = tokenInfo.expires_at;
        if (now > expiresAt) {
            return res.status(400).send({ status: false, message: 'Token has expired', meta: { token, expires_at: tokenInfo.expires_at } });
        }

        const user = await getUserById(tokenInfo.user_id);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found', meta: { token } });
        }

        await deleteToken(token, tokenInfo.user_id);
        res.send({ status: true, message: 'Token is valid', data: { user }, meta: { token } });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send({ status: false, message: 'Internal server error', meta: { token } });
    }
}

async function getTokenInfoByToken(token) {
    try {
        const tokenInfo = await models.one_time_tokens.findOne({
            where: { token },
            attributes: ['user_id', 'expires_at']
        });

        if (!tokenInfo) {
            return null;
        }

        return tokenInfo;
    } catch (error) {
        console.error('Error fetching token info:', error);
        throw error;
    }
}

async function getUserById(user_id) {
    try {
        const user = await models.users.findOne({
            where: { id: user_id },
            attributes: ['id', 'email', 'password', 'short_id', 'factory_id', 'name', 'phone', 'locked', 'user_type', 'city_phone', 'city_id', 'avatar', 'birthday', 'sex', 'device_code', 'modified', 'address', 'last_sync', 'code_sync', 'currencies_id']
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

async function deleteToken(token, user_id) {
    try {
        await models.one_time_tokens.destroy({
            where: { token, user_id }
        });
    } catch (error) {
        console.error('Error deleting token:', error);
        throw error;
    }
}