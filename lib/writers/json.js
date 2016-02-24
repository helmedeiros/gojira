const issue_line = require('../issue_line');
const durations = require('../durations');
const over_under = require('../over_under');

module.exports = {
    build: function (issues, working_times, config) {
        const lines = issues.map(function (issue) {
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
        return JSON.stringify(lines, null, 2);
    }
};
