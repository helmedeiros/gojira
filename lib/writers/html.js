const issue_line = require('../issue_line');
const durations = require('../durations');
const over_under = require('../over_under');

function escape(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function row(line) {
    const diff = over_under.diff(line.lead_time, line.projected_lead_time);
    const ratio = over_under.ratio(line.lead_time, line.projected_lead_time);
    const cells = [
        line.type, line.key, line.summary, line.status,
        line.points, line.projected_lead_time, line.lead_time,
        diff, ratio
    ];
    return '<tr>' + cells.map(function (c) {
        return '<td>' + escape(c) + '</td>';
    }).join('') + '</tr>';
}

const HEADERS = ['Type', 'Key', 'Summary', 'Status', 'Points', 'Projected', 'Actual', 'Over/Under', 'Ratio'];

module.exports = {
    build: function (issues, working_times, config) {
        const rows = issues.map(function (issue) {
            const line = issue_line.from(issue, config);
            durations.populate(
                line,
                working_times,
                line.key,
                config.csv_header_columns,
                config.first_column_to_count
            );
            return row(line);
        });
        const header = '<tr>' + HEADERS.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>';
        return '<table>\n<thead>' + header + '</thead>\n<tbody>\n' + rows.join('\n') + '\n</tbody>\n</table>\n';
    }
};
