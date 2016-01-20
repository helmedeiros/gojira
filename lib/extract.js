const control_chart_loader = require('./control_chart_loader');
const issues_loader = require('./issues_loader');
const csv_writer = require('./csv_writer');

module.exports = {
    run: function (config) {
        return Promise.all([
            control_chart_loader.load(config),
            issues_loader.load(config)
        ]).then(function (results) {
            const durations = results[0];
            const issues = results[1];
            if (!issues) {
                return null;
            }
            return csv_writer.build(issues, durations, config);
        });
    }
};
