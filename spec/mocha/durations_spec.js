var expect = require('chai').expect;
var durations = require('../../lib/durations');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('durations', function () {
    var line;
    var issues;
    var csv_columns = 'Backlog,In Progress,Validation,Sign Off,Done';

    beforeEach(function () {
        line = {};
        issues = [{
            key: 'DEMO-100',
            workingTime: [8 * DAY_MS, 5 * DAY_MS, 1 * DAY_MS, 2 * DAY_MS, 75 * DAY_MS]
        }];
    });

    it('does nothing when the key is not found', function () {
        durations.populate(line, issues, 'OTHER-1', csv_columns, 1);
        expect(line.times).to.be.undefined;
        expect(line.lead_time).to.be.undefined;
    });

    it('emits the times string for every column', function () {
        durations.populate(line, issues, 'DEMO-100', csv_columns, 1);
        expect(line.times).to.equal('8,5,1,2,75,');
    });

    it('sums lead time skipping backlog and final column', function () {
        durations.populate(line, issues, 'DEMO-100', csv_columns, 1);
        expect(line.lead_time).to.equal(8);
    });
});
