var http = require('./http');
var url_builder = require('./changelog_url');
var parser = require('./changelog_parser');

module.exports = {
    load: function (config, issue_key) {
        var url = url_builder.build(config.jira_base_url, issue_key, config.user, config.password);
        return http.get(url).then(function (issue) {
            return parser.extract(issue);
        });
    }
};
