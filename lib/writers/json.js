const issue_line = require('../issue_line');
const durations = require('../durations');
const over_under = require('../over_under');
const csv_writer = require('../csv_writer');

function build_lines(issues, working_times, config) {
    return issues.map(function (issue) {
        const line = issue_line.from(issue, config);
        durations.populate(
            line,
            working_times,
            line.key,
            config.csv_header_columns,
            config.first_column_to_count
        );
        line.over_under = over_under.diff(line.lead_time, line.projected_lead_time);
        line.over_under_ratio = over_under.ratio(line.lead_time, line.projected_lead_time);
        return line;
    });
}

module.exports = {
    build: function (issues, working_times, config) {
        const lines = build_lines(issues, working_times, config);
        if (config.include_metrics) {
            return JSON.stringify({ summary: csv_writer.summary(lines), lines: lines }, null, 2);
        }
        return JSON.stringify(lines, null, 2);
    }
};
