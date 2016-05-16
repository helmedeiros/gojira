var url_builder = require('./url');
var paginated = require('./paginated');
var changelog_loader = require('./changelog_loader');

function url_for_page(config, start_at) {
    return url_builder.issues(
        config.jira_base_url,
        config.project_key,
        config.component,
        config.work_group,
        config.max_results,
        config.user,
        config.password,
        'status!=Done',
        start_at
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
        var url_for = function (start_at) { return url_for_page(config, start_at); };
        return paginated.load(url_for).then(function (issues) {
            if (!issues.length || !config.include_changelog) {
                return issues;
            }
            return enrich_with_changelog(issues, config);
        });
    }
};
