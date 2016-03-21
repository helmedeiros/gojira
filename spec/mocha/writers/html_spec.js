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
            customfield_10003: 4
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
});
