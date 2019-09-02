var axios = require('axios');
var https = require('https');
var logger = require('./logger');

var DEFAULT_TIMEOUT_MS = 30000;

function build_options(override) {
    var opts = override || {};
    var options = {
        httpsAgent: new https.Agent({ rejectUnauthorized: opts.tls_reject_unauthorized !== false }),
        timeout: opts.timeout || DEFAULT_TIMEOUT_MS
    };
    if (opts.user) {
        options.auth = { username: opts.user, password: opts.password || '' };
    }
    return options;
}

var request_options = build_options({});

axios.interceptors.request.use(function (request) {
    logger.debug('HTTP GET ' + request.url);
    return request;
});

module.exports = {
    configure: function (override) {
        request_options = build_options(override);
    },
    get: function (url) {
        return axios.get(url, request_options).then(function (response) {
            return response.data;
        });
    }
};
