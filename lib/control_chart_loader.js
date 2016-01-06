const http = require('./http');
const url_builder = require('./url');

module.exports = {
    load: function (config, callback) {
        const url = url_builder.control_chart(
            config.jira_base_url,
            config.control_chart,
            config.user,
            config.password,
            config.from,
            config.to
        );
        http.get(url, function (err, response, body) {
            if (err) {
                return callback(err);
            }
            try {
                callback(null, JSON.parse(body).issues);
            } catch (parse_err) {
                callback(parse_err);
            }
        });
    }
};
