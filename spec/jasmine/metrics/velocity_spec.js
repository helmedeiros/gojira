var velocity = require('../../../lib/metrics/velocity');

describe('velocity', function () {
    it('returns 0 for missing input', function () {
        expect(velocity.compute(null)).toBe(0);
    });

    it('returns 0 for empty array', function () {
        expect(velocity.compute([])).toBe(0);
    });

    it('sums points across lines', function () {
        expect(velocity.compute([{ points: 3 }, { points: 5 }, { points: 8 }])).toBe(16);
    });

    it('treats missing points as zero', function () {
        expect(velocity.compute([{ points: 3 }, {}, { points: 2 }])).toBe(5);
    });
});
