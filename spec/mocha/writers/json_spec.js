var expect = require('chai').expect;
var json_writer = require('../../../lib/writers/json');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('writers/json', function () {
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

    it('returns a JSON array with one entry per issue', function () {
        var parsed = JSON.parse(json_writer.build(issues, working_times, config));
        expect(parsed.length).to.equal(1);
        expect(parsed[0].key).to.equal('DEMO-1');
        expect(parsed[0].type).to.equal('Story');
    });

    it('includes projected and actual lead time', function () {
        var parsed = JSON.parse(json_writer.build(issues, working_times, config));
        expect(parsed[0].projected_lead_time).to.equal(5);
        expect(parsed[0].lead_time).to.equal(5);
    });
});
