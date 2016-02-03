const issue_line = require('../issue_line');
const durations = require('../durations');
const over_under = require('../over_under');

const HEADER = '| Type | Key | Summary | Status | Points | Projected | Actual | Over/Under | Ratio |';
const SEPARATOR = '|------|-----|---------|--------|--------|-----------|--------|------------|-------|';

function row(line) {
    const diff = over_under.diff(line.lead_time, line.projected_lead_time);
    const ratio = over_under.ratio(line.lead_time, line.projected_lead_time);
    return `| ${line.type} | ${line.key} | ${line.summary} | ${line.status} | ${line.points} | ${line.projected_lead_time} | ${line.lead_time} | ${diff} | ${ratio} |`;
}

module.exports = {
    build: function (issues, working_times, config) {
        const rows = issues.map(function (issue) {
            const line = issue_line.from(issue, config.points_per_day);
            durations.populate(
                line,
                working_times,
                line.key,
                config.csv_header_columns,
                config.first_column_to_count
            );
            return row(line);
        });
        return [HEADER, SEPARATOR].concat(rows).join('\n') + '\n';
    }
};
