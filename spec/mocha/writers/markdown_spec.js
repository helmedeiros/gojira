var expect = require('chai').expect;
var markdown_writer = require('../../../lib/writers/markdown');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('writers/markdown', function () {
    var config = {
        points_per_day: 1.25,
        csv_header_columns: 'Backlog,In Progress,Done',
        first_column_to_count: 1
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

    it('starts with a header row and a separator row', function () {
        var rows = markdown_writer.build(issues, working_times, config).split('\n');
        expect(rows[0]).to.equal('| Type | Key | Summary | Status | Points | Projected | Actual | Over/Under | Ratio |');
        expect(rows[1]).to.equal('|------|-----|---------|--------|--------|-----------|--------|------------|-------|');
    });

    it('emits one row per issue', function () {
        var rows = markdown_writer.build(issues, working_times, config)
            .split('\n')
            .filter(function (r) { return r.length > 0; });
        expect(rows.length).to.equal(3);
        expect(rows[2]).to.contain('DEMO-1');
        expect(rows[2]).to.contain('Sample');
    });
});
