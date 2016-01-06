const request = require('request');

module.exports = {
    get: function (url, callback) {
        request({ url: url, rejectUnauthorized: false }, callback);
    }
};
