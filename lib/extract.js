const control_chart_loader = require('./control_chart_loader');
const issues_loader = require('./issues_loader');
const writers = require('./writers');

module.exports = {
    run: function (config) {
        return Promise.all([
            control_chart_loader.load(config),
            issues_loader.load(config)
        ]).then(function (results) {
            const working_times = results[0];
            const issues = results[1];
            if (!issues) {
                return { output: null, issues: null, working_times: working_times };
            }
            const output = writers.for_format(config.output_format).build(issues, working_times, config);
            return { output: output, issues: issues, working_times: working_times };
        });
    }
};
