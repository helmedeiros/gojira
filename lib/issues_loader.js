const http = require('./http');
const url_builder = require('./url');
const changelog_loader = require('./changelog_loader');

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

function enrich_with_changelog(issues, config) {
    return Promise.all(issues.map(function (issue) {
        return changelog_loader.load(config, issue.key).then(function (events) {
            issue.transitions = events;
            return issue;
        });
    }));
}

module.exports = {
    load: function (config) {
        return http.get(url_for(config)).then(function (data) {
            var issues = data.issues;
            if (!issues || !config.include_changelog) {
                return issues;
            }
            return enrich_with_changelog(issues, config);
        });
    }
};
