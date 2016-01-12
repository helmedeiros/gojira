const axios = require('axios');
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

module.exports = {
    get: function (url, callback) {
        axios.get(url, { httpsAgent: agent })
            .then(function (response) {
                callback(null, response.data);
            })
            .catch(function (error) {
                callback(error);
            });
    }
};
