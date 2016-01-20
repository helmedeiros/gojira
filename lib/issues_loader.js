const http = require('./http');
const url_builder = require('./url');

function url_for(config) {
    return url_builder.issues(
        config.jira_base_url,
        config.project_key,
        config.component,
        config.work_group,
        config.max_results,
        config.user,
        config.password
    );
}

module.exports = {
    load: function (config) {
        return http.get(url_for(config)).then(function (data) {
            return data.issues;
        });
    }
};
