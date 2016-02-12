var wip = require('../../../lib/metrics/wip');

describe('wip', function () {
    it('returns 0 for missing input', function () {
        expect(wip.compute(null)).toBe(0);
    });

    it('returns 0 when all items are Backlog or Done', function () {
        var lines = [{ status: 'Backlog' }, { status: 'Done' }, { status: 'Done' }];
        expect(wip.compute(lines)).toBe(0);
    });

    it('counts items in active statuses', function () {
        var lines = [
            { status: 'Backlog' },
            { status: 'In Progress' },
            { status: 'Validation' },
            { status: 'Done' }
        ];
        expect(wip.compute(lines)).toBe(2);
    });
});
