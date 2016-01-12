const axios = require('axios');
const https = require('https');

const DEFAULT_TIMEOUT_MS = 30000;

let client = build_client(DEFAULT_TIMEOUT_MS);

function build_client(timeout) {
    return axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: timeout
    });
}

module.exports = {
    configure: function (options) {
        const timeout = (options && options.timeout) || DEFAULT_TIMEOUT_MS;
        client = build_client(timeout);
    },
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
