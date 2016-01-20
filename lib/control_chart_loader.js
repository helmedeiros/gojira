const http = require('./http');
const url_builder = require('./url');

function url_for(config) {
    return url_builder.control_chart(
        config.jira_base_url,
        config.control_chart,
        config.user,
        config.password,
        config.from,
        config.to
    );
}

module.exports = {
    load: function (config) {
        return http.get(url_for(config)).then(function (data) {
            return data.issues;
        });
    }
};
