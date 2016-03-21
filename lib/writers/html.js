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

const STYLE = [
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #24292e; margin: 2rem; }',
    'h1 { font-size: 1.5rem; margin: 0 0 1rem; }',
    'table { border-collapse: collapse; width: 100%; font-size: 0.9rem; }',
    'th, td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #e1e4e8; text-align: left; }',
    'thead th { background: #f6f8fa; font-weight: 600; }',
    'tbody tr:nth-child(even) { background: #fafbfc; }',
    'td:nth-child(2) { font-family: SFMono-Regular, Menlo, monospace; color: #0366d6; }',
    'td:nth-child(n+5) { text-align: right; font-variant-numeric: tabular-nums; }'
].join('\n        ');

function document(table) {
    return [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '    <meta charset="utf-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1">',
        '    <title>gojira report</title>',
        '    <style>',
        '        ' + STYLE,
        '    </style>',
        '</head>',
        '<body>',
        '    <h1>gojira report</h1>',
        '    ' + table.replace(/\n/g, '\n    '),
        '</body>',
        '</html>',
        ''
    ].join('\n');
}

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
        const table = '<table>\n<thead>' + header + '</thead>\n<tbody>\n' + rows.join('\n') + '\n</tbody>\n</table>';
        return document(table);
    }
};
