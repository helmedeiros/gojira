var expect = require('chai').expect;
var html_writer = require('../../../lib/writers/html');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('writers/html', function () {
    var config = {
        points_per_day: 1.25,
        csv_header_columns: 'Backlog,In Progress,Done',
        first_column_to_count: 1,
        story_points_field: 'customfield_10003'
    };

    var issues = [{
        key: 'DEMO-1',
        fields: {
            issuetype: { name: 'Story' },
            status: { name: 'Done' },
            summary: 'Sample',
            customfield_10003: 4,
            created: '2016-01-05T09:00:00.000+0000',
            resolutiondate: '2016-01-12T17:00:00.000+0000'
        }
    }];

    var working_times = [{
        key: 'DEMO-1',
        workingTime: [2 * DAY_MS, 5 * DAY_MS, 0]
    }];

    it('emits a table with thead and tbody', function () {
        var out = html_writer.build(issues, working_times, config);
        expect(out).to.contain('<table>');
        expect(out).to.contain('<thead>');
        expect(out).to.contain('<tbody>');
        expect(out).to.contain('</table>');
    });

    it('emits a header row with every column', function () {
        var out = html_writer.build(issues, working_times, config);
        expect(out).to.contain('<th>Type</th>');
        expect(out).to.contain('<th>Key</th>');
        expect(out).to.contain('<th>Summary</th>');
        expect(out).to.contain('<th>Status</th>');
        expect(out).to.contain('<th>Points</th>');
        expect(out).to.contain('<th>Projected</th>');
        expect(out).to.contain('<th>Actual</th>');
        expect(out).to.contain('<th>Over/Under</th>');
        expect(out).to.contain('<th>Ratio</th>');
    });

    it('emits one tr per issue with the data cells', function () {
        var out = html_writer.build(issues, working_times, config);
        expect(out).to.contain('<td>DEMO-1</td>');
        expect(out).to.contain('<td>Story</td>');
        expect(out).to.contain('<td>Done</td>');
    });

    it('emits a full HTML document with DOCTYPE, head and body', function () {
        var out = html_writer.build(issues, working_times, config);
        expect(out).to.match(/^<!DOCTYPE html>/);
        expect(out).to.contain('<html lang="en">');
        expect(out).to.contain('<meta charset="utf-8">');
        expect(out).to.contain('<title>gojira report</title>');
        expect(out).to.contain('<body>');
        expect(out).to.contain('</html>');
    });

    it('embeds a CSS theme inside the head', function () {
        var out = html_writer.build(issues, working_times, config);
        var head_to_body = out.slice(0, out.indexOf('<body>'));
        expect(head_to_body).to.contain('<style>');
        expect(head_to_body).to.contain('border-collapse: collapse');
    });

    it('escapes HTML special characters in cell content', function () {
        var risky = [{
            key: 'DEMO-2',
            fields: {
                issuetype: { name: 'Bug' },
                status: { name: 'Done' },
                summary: '<script>alert("xss")</script> & friends',
                customfield_10003: 2
            }
        }];
        var out = html_writer.build(risky, working_times, config);
        expect(out).to.not.contain('<script>alert');
        expect(out).to.contain('&lt;script&gt;');
        expect(out).to.contain('&amp;');
        expect(out).to.contain('&quot;xss&quot;');
    });

    it('omits the summary panel by default', function () {
        var out = html_writer.build(issues, working_times, config);
        expect(out).to.not.contain('<section class="summary">');
        expect(out).to.not.contain('Throughput');
    });

    it('appends a summary panel when include_metrics is true', function () {
        var enriched = Object.assign({}, config, { include_metrics: true });
        var out = html_writer.build(issues, working_times, enriched);
        expect(out).to.contain('class="summary');
        expect(out).to.contain('<h2>Summary</h2>');
        expect(out).to.contain('Throughput');
        expect(out).to.contain('Cycle time mean');
        expect(out).to.contain('Cycle time p95');
    });

    it('embeds chart SVGs when include_metrics is true', function () {
        var enriched = Object.assign({}, config, { include_metrics: true });
        var out = html_writer.build(issues, working_times, enriched);
        expect(out).to.contain('<section class="charts">');
        expect(out).to.contain('<div class="charts-grid">');
        expect(out).to.contain('Cumulative flow (approximate)');
        expect(out).to.contain('Cycle time distribution (days)');
        expect(out).to.contain('Cycle time over time');
        expect(out).to.contain('Throughput per ISO week');
        expect(out).to.contain('Time in each column');
        expect(out).to.contain('<svg');
    });

    it('lays out charts in a two-column grid via CSS', function () {
        var enriched = Object.assign({}, config, { include_metrics: true });
        var out = html_writer.build(issues, working_times, enriched);
        expect(out).to.contain('grid-template-columns: repeat(2, 1fr)');
    });

    it('renders aging WIP when active_issues are provided and include_metrics is true', function () {
        var enriched = Object.assign({}, config, { include_metrics: true });
        var active = [
            {
                key: 'DEMO-501',
                fields: {
                    status: { name: 'In Progress' },
                    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                }
            }
        ];
        var out = html_writer.build(issues, working_times, enriched, active);
        expect(out).to.contain('Aging WIP');
        expect(out).to.contain('DEMO-501');
    });

    it('omits chart SVGs when include_metrics is false', function () {
        var out = html_writer.build(issues, working_times, config);
        expect(out).to.not.contain('<section class="charts">');
        expect(out).to.not.contain('<svg');
    });
});
