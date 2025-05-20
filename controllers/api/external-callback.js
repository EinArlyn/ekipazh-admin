const models = require('../../lib/models');
const https = require('https');
const { URL } = require('url'); // Явный импорт URL

module.exports = async function (req, res) {
    try {
        const { device_code, callback_url } = req.body;
        if (!device_code || !callback_url) {
            return res.status(400).send({ status: false, message: 'Missing required fields' });
        }

        const user = await getUserByDeviceCode(device_code);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }

        const timestamp = Date.now();
        const data = { user_id: user.id, timestamp };

        try {
            const response = await sendPostRequest(callback_url, data);
            res.send({ status: true, message: 'Callback request sent successfully', response });
        } catch (error) {
            console.error('Error sending POST request:', error);
            res.status(500).send({ status: false, message: `Failed to send callback request: ${error.message}` });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

async function getUserByDeviceCode(device_code) {
    try {
        const user = await models.users.findOne({
            where: { device_code },
            attributes: ['id']
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

async function sendPostRequest(callback_url, data) {
    return new Promise((resolve, reject) => {
        try {
            const url = new URL(callback_url);
            const options = {
                hostname: url.hostname,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(responseData);
                    } else {
                        reject(new Error(`Request failed with status ${res.statusCode}: ${responseData}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Network error: ${error.message}`));
            });

            req.write(JSON.stringify(data));
            req.end();
        } catch (error) {
            reject(new Error(`Unexpected error: ${error.message}`));
        }
    });
}
