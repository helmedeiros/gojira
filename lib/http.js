const axios = require('axios');
const https = require('https');

const DEFAULT_TIMEOUT_MS = 30000;

let client = build_client(DEFAULT_TIMEOUT_MS);

function build_client(timeout) {
    const instance = axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: timeout
    });
    instance.interceptors.request.use(function (request) {
        console.log(`HTTP GET ${request.url}`);
        return request;
    });
    return instance;
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
    },
    get_promise: function (url) {
        return client.get(url).then(function (response) {
            return response.data;
        });
    }
};
