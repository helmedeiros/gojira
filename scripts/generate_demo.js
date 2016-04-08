var path = require('path');
var fs = require('fs');
var html_writer = require('../lib/writers/html');

var DAY = 24 * 60 * 60 * 1000;

var config = {
    points_per_day: 1.25,
    csv_header_columns: 'Backlog,In Progress,Code Review,QA,Done',
    first_column_to_count: 1,
    story_points_field: 'customfield_10003',
    include_metrics: true
};

function issue(key, type, points, summary, created, resolved) {
    return {
        key: key,
        fields: {
            issuetype: { name: type },
            status: { name: 'Done' },
            summary: summary,
            customfield_10003: points,
            created: created,
            resolutiondate: resolved
        }
    };
}

var issues = [
    issue('DEMO-101', 'Story', 5, 'Add carrier filter to search results', '2016-01-04T09:00:00.000+0000', '2016-01-15T17:00:00.000+0000'),
    issue('DEMO-102', 'Story', 3, 'Display origin timezone on itinerary', '2016-01-08T09:00:00.000+0000', '2016-01-22T17:00:00.000+0000'),
    issue('DEMO-103', 'Bug', 2, 'Total fare drops the currency symbol on iOS', '2016-01-20T09:00:00.000+0000', '2016-01-22T17:00:00.000+0000'),
    issue('DEMO-104', 'Story', 8, 'Persist user filter selections across sessions', '2016-01-18T09:00:00.000+0000', '2016-02-05T17:00:00.000+0000'),
    issue('DEMO-105', 'Story', 13, 'Surface refund eligibility on the booking detail page', '2016-01-25T09:00:00.000+0000', '2016-02-19T17:00:00.000+0000'),
    issue('DEMO-106', 'Bug', 1, 'Date picker offsets by one day in DST week', '2016-02-22T09:00:00.000+0000', '2016-02-26T17:00:00.000+0000'),
    issue('DEMO-107', 'Story', 5, 'Send confirmation email in the locale of the user', '2016-02-20T09:00:00.000+0000', '2016-03-04T17:00:00.000+0000')
];

var working = [
    { key: 'DEMO-101', workingTime: [1 * DAY, 2 * DAY, 1 * DAY, 1 * DAY, 90 * DAY] },
    { key: 'DEMO-102', workingTime: [5 * DAY, 3 * DAY, 0, 1 * DAY, 60 * DAY] },
    { key: 'DEMO-103', workingTime: [0, 1 * DAY, 0, 1 * DAY, 45 * DAY] },
    { key: 'DEMO-104', workingTime: [3 * DAY, 8 * DAY, 2 * DAY, 3 * DAY, 30 * DAY] },
    { key: 'DEMO-105', workingTime: [7 * DAY, 12 * DAY, 4 * DAY, 5 * DAY, 14 * DAY] },
    { key: 'DEMO-106', workingTime: [0, 1 * DAY, 0, 1 * DAY, 7 * DAY] },
    { key: 'DEMO-107', workingTime: [2 * DAY, 4 * DAY, 1 * DAY, 2 * DAY, 21 * DAY] }
];

var output_path = path.resolve(__dirname, '..', 'docs', 'demo', 'sample_report.html');
fs.writeFileSync(output_path, html_writer.build(issues, working, config));
console.log('wrote', fs.statSync(output_path).size, 'bytes to', path.relative(process.cwd(), output_path));
