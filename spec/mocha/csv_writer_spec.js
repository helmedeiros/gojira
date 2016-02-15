var expect = require('chai').expect;
var csv_writer = require('../../lib/csv_writer');

describe('csv_writer.summary', function () {
    it('returns zero metrics for empty input', function () {
        var summary = csv_writer.summary([]);
        expect(summary.throughput).to.equal(0);
        expect(summary.velocity).to.equal(0);
        expect(summary.wip).to.equal(0);
    });

    it('aggregates throughput, velocity and wip from lines', function () {
        var lines = [
            { status: 'Done', points: 3 },
            { status: 'In Progress', points: 5 },
            { status: 'Done', points: 8 }
        ];
        var summary = csv_writer.summary(lines);
        expect(summary.throughput).to.equal(3);
        expect(summary.velocity).to.equal(16);
        expect(summary.wip).to.equal(1);
    });
});
