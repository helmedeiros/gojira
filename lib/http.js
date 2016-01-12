const axios = require('axios');
const https = require('https');

const DEFAULT_TIMEOUT_MS = 30000;

const client = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    timeout: DEFAULT_TIMEOUT_MS
});

module.exports = {
    get: function (url, callback) {
        client.get(url)
            .then(function (response) {
                callback(null, response.data);
            })
            .catch(function (error) {
                callback(error);
            });
    }
};
