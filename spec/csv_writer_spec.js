var csv_writer = require('../lib/csv_writer');

describe('csv_writer.summary', function () {
    it('returns zero metrics for empty input', function () {
        var summary = csv_writer.summary([]);
        expect(summary.throughput).toBe(0);
        expect(summary.velocity).toBe(0);
        expect(summary.wip).toBe(0);
    });

    it('aggregates throughput, velocity and wip from lines', function () {
        var lines = [
            { status: 'Done', points: 3 },
            { status: 'In Progress', points: 5 },
            { status: 'Done', points: 8 }
        ];
        var summary = csv_writer.summary(lines);
        expect(summary.throughput).toBe(3);
        expect(summary.velocity).toBe(16);
        expect(summary.wip).toBe(1);
    });
});
