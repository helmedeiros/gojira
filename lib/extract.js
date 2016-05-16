const control_chart_loader = require('./control_chart_loader');
const issues_loader = require('./issues_loader');
const active_loader = require('./active_loader');
const writers = require('./writers');

function fetch_all(config) {
    const fetches = [
        control_chart_loader.load(config),
        issues_loader.load(config)
    ];
    if (config.include_aging_wip) {
        fetches.push(active_loader.load(config));
    }
    return Promise.all(fetches);
}

module.exports = {
    run: function (config) {
        return fetch_all(config).then(function (results) {
            const working_times = results[0];
            const issues = results[1];
            const active_issues = results[2] || [];
            if (!issues || issues.length === 0) {
                return { output: null, issues: null, working_times: working_times, active_issues: active_issues };
            }
            const output = writers.for_format(config.output_format).build(issues, working_times, config, active_issues);
            return { output: output, issues: issues, working_times: working_times, active_issues: active_issues };
        });
    }
};
