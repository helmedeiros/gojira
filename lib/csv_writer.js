const csv = require('./csv');
const issue_line = require('./issue_line');
const durations = require('./durations');

module.exports = {
    build: function (issues, working_times, config) {
        let output = csv.header(config.csv_header_columns);
        for (let i = 0; i < issues.length; i++) {
            const line = issue_line.from(issues[i], config.points_per_day);
            durations.populate(
                line,
                working_times,
                line.key,
                config.csv_header_columns,
                config.first_column_to_count
            );
            output += csv.from(line);
        }
        return output;
    }
};
