const http = require('./http');
const url_builder = require('./url');

module.exports = {
    load: function (config, callback) {
        const url = url_builder.issues(
            config.jira_base_url,
            config.project_key,
            config.component,
            config.work_group,
            config.max_results,
            config.user,
            config.password
        );
        http.get(url, function (err, data) {
            if (err) {
                return callback(err);
            }
            callback(null, data.issues);
        });
    }
};
