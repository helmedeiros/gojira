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

var issues = [
    { key: 'DEMO-101', fields: { issuetype: { name: 'Story' }, status: { name: 'Done' }, summary: 'Add carrier filter to search results', customfield_10003: 5 } },
    { key: 'DEMO-102', fields: { issuetype: { name: 'Story' }, status: { name: 'Done' }, summary: 'Display origin timezone on itinerary', customfield_10003: 3 } },
    { key: 'DEMO-103', fields: { issuetype: { name: 'Bug' }, status: { name: 'Done' }, summary: 'Total fare drops the currency symbol on iOS', customfield_10003: 2 } },
    { key: 'DEMO-104', fields: { issuetype: { name: 'Story' }, status: { name: 'Done' }, summary: 'Persist user filter selections across sessions', customfield_10003: 8 } },
    { key: 'DEMO-105', fields: { issuetype: { name: 'Story' }, status: { name: 'Done' }, summary: 'Surface refund eligibility on the booking detail page', customfield_10003: 13 } },
    { key: 'DEMO-106', fields: { issuetype: { name: 'Bug' }, status: { name: 'Done' }, summary: 'Date picker offsets by one day in DST week', customfield_10003: 1 } },
    { key: 'DEMO-107', fields: { issuetype: { name: 'Story' }, status: { name: 'Done' }, summary: 'Send confirmation email in the locale of the user', customfield_10003: 5 } }
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
