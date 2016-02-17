var axios = require('axios');
var https = require('https');

var DEFAULT_TIMEOUT_MS = 30000;

var request_options = build_options(DEFAULT_TIMEOUT_MS);

axios.interceptors.request.use(function (request) {
    console.log('HTTP GET ' + request.url);
    return request;
});

function build_options(timeout) {
    return {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: timeout
    };
}

module.exports = {
    configure: function (override) {
        var timeout = (override && override.timeout) || DEFAULT_TIMEOUT_MS;
        request_options = build_options(timeout);
    },
    get: function (url) {
        return axios.get(url, request_options).then(function (response) {
            return response.data;
        });
    }
};
