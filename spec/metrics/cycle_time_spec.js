var cycle_time = require('../../lib/metrics/cycle_time');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('cycle_time', function () {
    it('returns 0 when working_times is empty', function () {
        expect(cycle_time.compute([], 1)).toBe(0);
        expect(cycle_time.compute(null, 1)).toBe(0);
    });

    it('sums columns between start and last (exclusive)', function () {
        var times = [8 * DAY_MS, 5 * DAY_MS, 1 * DAY_MS, 2 * DAY_MS, 75 * DAY_MS];
        expect(cycle_time.compute(times, 1)).toBe(8);
    });

    it('skips additional leading columns when start is greater', function () {
        var times = [8 * DAY_MS, 5 * DAY_MS, 1 * DAY_MS, 2 * DAY_MS, 75 * DAY_MS];
        expect(cycle_time.compute(times, 2)).toBe(3);
    });
});
