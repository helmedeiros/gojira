var path = require('path');
var fs = require('fs');
var html_writer = require('../lib/writers/html');

var DAY = 24 * 60 * 60 * 1000;
var COLUMNS = ['Backlog', 'In Progress', 'Code Review', 'QA', 'Done'];

var config = {
    points_per_day: 1.25,
    csv_header_columns: COLUMNS.join(','),
    first_column_to_count: 1,
    story_points_field: 'customfield_10003',
    include_metrics: true
};

function gen_transitions(times_days, resolved_iso) {
    var resolved_ms = new Date(resolved_iso).getTime();
    var entered = new Array(COLUMNS.length);
    entered[COLUMNS.length - 1] = resolved_ms;
    for (var i = COLUMNS.length - 2; i >= 0; i--) {
        entered[i] = entered[i + 1] - times_days[i] * DAY;
    }
    return COLUMNS.map(function (column, idx) {
        return { at: new Date(entered[idx]).toISOString(), to_status: column };
    });
}

function issue(key, type, points, summary, created, resolved, times_days) {
    return {
        key: key,
        fields: {
            issuetype: { name: type },
            status: { name: 'Done' },
            summary: summary,
            customfield_10003: points,
            created: created,
            resolutiondate: resolved
        },
        transitions: gen_transitions(times_days, resolved)
    };
}

var demo_data = [
    { key: 'DEMO-101', type: 'Story', pts: 5, summary: 'Add carrier filter to search results',
      created: '2016-01-04T09:00:00.000+0000', resolved: '2016-01-15T17:00:00.000+0000',
      times: [1, 2, 1, 1, 90] },
    { key: 'DEMO-102', type: 'Story', pts: 3, summary: 'Display origin timezone on itinerary',
      created: '2016-01-08T09:00:00.000+0000', resolved: '2016-01-22T17:00:00.000+0000',
      times: [5, 3, 0, 1, 60] },
    { key: 'DEMO-103', type: 'Bug', pts: 2, summary: 'Total fare drops the currency symbol on iOS',
      created: '2016-01-20T09:00:00.000+0000', resolved: '2016-01-22T17:00:00.000+0000',
      times: [0, 1, 0, 1, 45] },
    { key: 'DEMO-104', type: 'Story', pts: 8, summary: 'Persist user filter selections across sessions',
      created: '2016-01-18T09:00:00.000+0000', resolved: '2016-02-05T17:00:00.000+0000',
      times: [3, 8, 2, 3, 30] },
    { key: 'DEMO-105', type: 'Story', pts: 13, summary: 'Surface refund eligibility on the booking detail page',
      created: '2016-01-25T09:00:00.000+0000', resolved: '2016-02-19T17:00:00.000+0000',
      times: [7, 12, 4, 5, 14] },
    { key: 'DEMO-106', type: 'Bug', pts: 1, summary: 'Date picker offsets by one day in DST week',
      created: '2016-02-22T09:00:00.000+0000', resolved: '2016-02-26T17:00:00.000+0000',
      times: [0, 1, 0, 1, 7] },
    { key: 'DEMO-107', type: 'Story', pts: 5, summary: 'Send confirmation email in the locale of the user',
      created: '2016-02-20T09:00:00.000+0000', resolved: '2016-03-04T17:00:00.000+0000',
      times: [2, 4, 1, 2, 21] }
];

var issues = demo_data.map(function (d) {
    return issue(d.key, d.type, d.pts, d.summary, d.created, d.resolved, d.times);
});

var working = demo_data.map(function (d) {
    return { key: d.key, workingTime: d.times.map(function (t) { return t * DAY; }) };
});

var NOW = Date.now();

var active_data = [
    { key: 'DEMO-201', status: 'In Progress', days: 18, summary: 'Profile photo upload regression on Android', type: 'Bug', pts: 5 },
    { key: 'DEMO-202', status: 'Code Review', days: 6, summary: 'Switch onboarding to passwordless flow', type: 'Story', pts: 8 },
    { key: 'DEMO-203', status: 'In Progress', days: 4, summary: 'Add Spanish copy for booking confirmation email', type: 'Story', pts: 3 },
    { key: 'DEMO-204', status: 'QA', days: 11, summary: 'Round-trip filter ignores return city on long-haul', type: 'Bug', pts: 2 },
    { key: 'DEMO-205', status: 'In Progress', days: 2, summary: 'Cache control_chart response for 60 seconds', type: 'Story', pts: 3 }
];

var active_issues = active_data.map(function (d) {
    var since_iso = new Date(NOW - d.days * DAY).toISOString();
    return {
        key: d.key,
        fields: {
            issuetype: { name: d.type },
            status: { name: d.status },
            summary: d.summary,
            customfield_10003: d.pts,
            created: since_iso
        },
        transitions: [
            { at: since_iso, to_status: d.status }
        ]
    };
});

var output_path = path.resolve(__dirname, '..', 'docs', 'demo', 'sample_report.html');
fs.writeFileSync(output_path, html_writer.build(issues, working, config, active_issues));
console.log('wrote', fs.statSync(output_path).size, 'bytes to', path.relative(process.cwd(), output_path));
