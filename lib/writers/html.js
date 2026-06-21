const issue_line = require('../issue_line');
const durations = require('../durations');
const over_under = require('../over_under');
const csv_writer = require('../csv_writer');
const chart_builder = require('../chart_builder');

const CHART_CAPTIONS = {
    'cfd.svg': 'Cumulative items in each status over time, back-derived from resolution date and column durations.',
    'cycle_time_histogram.svg': 'Histogram of lead times across resolved issues.',
    'lead_time_histogram.svg': 'Wall-clock days from issue creation to resolution — includes queue/backlog time. Compare with the cycle-time histogram to see waiting vs in-flight time.',
    'cycle_time_scatter.svg': 'Each dot is one issue: x = resolution date, y = cycle time in days.',
    'throughput_by_week.svg': 'Number of issues resolved each ISO week.',
    'time_in_column.svg': 'How long each issue spent in each status column.',
    'aging_wip.svg': 'Active items ordered by how many days they have spent in their current status.'
};

function escape(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function build_line(issue, working_times, config) {
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
}

function data_row(line) {
    const cells = [
        line.type, line.key, line.summary, line.status,
        line.points, line.projected_lead_time, line.lead_time,
        line.over_under, line.over_under_ratio
    ];
    return '<tr>' + cells.map(function (c) {
        return '<td>' + escape(c) + '</td>';
    }).join('') + '</tr>';
}

function summary_panel(lines) {
    const summary = csv_writer.summary(lines);
    const stats = summary.cycle_time_stats;
    const items = [
        ['Throughput', summary.throughput],
        ['Velocity (points)', summary.velocity],
        ['WIP', summary.wip],
        ['Cycle time count', stats.count],
        ['Cycle time mean', stats.mean],
        ['Cycle time median', stats.median],
        ['Cycle time p85', stats.p85],
        ['Cycle time p95', stats.p95]
    ];
    const rows = items.map(function (item) {
        return '<tr><th scope="row">' + escape(item[0]) + '</th><td>' + escape(item[1]) + '</td></tr>';
    });
    return '<section class="summary"><h2>Summary</h2>\n<table>\n<tbody>\n' + rows.join('\n') + '\n</tbody>\n</table>\n</section>';
}

function figure(svg_markup, caption, css_class) {
    const cls = css_class ? ' class="' + css_class + '"' : '';
    return '<figure' + cls + '>\n' + svg_markup + '\n<figcaption>' + escape(caption) + '</figcaption>\n</figure>';
}

const FULL_WIDTH_CHARTS = ['cfd.svg', 'aging_wip.svg'];

function charts_panel(lines, config, active_issues) {
    const figures = chart_builder.build(lines, config, { active_issues: active_issues }).map(function (chart) {
        const cls = FULL_WIDTH_CHARTS.indexOf(chart.name) === -1 ? null : 'span-full';
        return figure(chart.svg, CHART_CAPTIONS[chart.name] || '', cls);
    });
    return '<section class="charts">\n<h2>Charts</h2>\n<div class="charts-grid">\n' + figures.join('\n') + '\n</div>\n</section>';
}

const HEADERS = ['Type', 'Key', 'Summary', 'Status', 'Points', 'Projected', 'Actual', 'Over/Under', 'Ratio'];

const STYLE = [
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #24292e; margin: 2rem; }',
    'h1 { font-size: 1.5rem; margin: 0 0 1rem; }',
    'h2 { font-size: 1.15rem; margin: 1.5rem 0 0.5rem; }',
    'table { border-collapse: collapse; width: 100%; font-size: 0.9rem; }',
    'th, td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #e1e4e8; text-align: left; }',
    'thead th { background: #f6f8fa; font-weight: 600; }',
    'tbody tr:nth-child(even) { background: #fafbfc; }',
    '.summary table { width: auto; }',
    '.summary th { background: #f6f8fa; }',
    '.charts { max-width: 1080px; }',
    '.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem 1.5rem; }',
    '.charts-grid figure { margin: 0; min-width: 0; }',
    '.charts-grid figure.span-full { grid-column: 1 / -1; }',
    '.charts-grid svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }',
    '.charts-grid figure.span-full svg { width: 100%; }',
    '.charts figcaption { font-size: 0.8rem; color: #586069; margin-top: 0.25rem; }',
    '@media (max-width: 720px) { .charts-grid { grid-template-columns: 1fr; } }',
    'td:nth-child(2) { font-family: SFMono-Regular, Menlo, monospace; color: #0366d6; }',
    'td:nth-child(n+5) { text-align: right; font-variant-numeric: tabular-nums; }'
].join('\n        ');

function document(body) {
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
        '    ' + body.replace(/\n/g, '\n    '),
        '</body>',
        '</html>',
        ''
    ].join('\n');
}

module.exports = {
    build: function (issues, working_times, config, active_issues) {
        const lines = issues.map(function (issue) {
            return build_line(issue, working_times, config);
        });
        const header = '<tr>' + HEADERS.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>';
        const rows = lines.map(data_row);
        const table = '<table>\n<thead>' + header + '</thead>\n<tbody>\n' + rows.join('\n') + '\n</tbody>\n</table>';
        const body = config.include_metrics
            ? table + '\n' + summary_panel(lines) + '\n' + charts_panel(lines, config, active_issues)
            : table;
        return document(body);
    }
};
