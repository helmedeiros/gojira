var expect = require('chai').expect;
var percentile = require('../../../lib/metrics/percentile');

describe('percentile', function () {
    it('returns 0 for missing or empty input', function () {
        expect(percentile.compute(null, 0.5)).to.equal(0);
        expect(percentile.compute([], 0.5)).to.equal(0);
    });

    it('returns the only value for a singleton array', function () {
        expect(percentile.compute([7], 0.5)).to.equal(7);
    });

    it('returns the minimum at p<=0 and maximum at p>=1', function () {
        var values = [9, 1, 4, 6, 3];
        expect(percentile.compute(values, 0)).to.equal(1);
        expect(percentile.compute(values, 1)).to.equal(9);
    });

    it('returns the median for p=0.5 on an odd-length array', function () {
        expect(percentile.compute([1, 2, 3, 4, 5], 0.5)).to.equal(3);
    });

    it('linearly interpolates between adjacent ranks', function () {
        expect(percentile.compute([1, 2, 3, 4], 0.5)).to.equal(2.5);
    });

    it('computes p85 on a small sample', function () {
        var values = [2, 4, 4, 4, 5, 5, 7, 9];
        expect(percentile.compute(values, 0.85)).to.be.closeTo(6.9, 0.0001);
    });

    it('is order-independent', function () {
        expect(percentile.compute([5, 3, 8, 1, 4], 0.5))
            .to.equal(percentile.compute([1, 3, 4, 5, 8], 0.5));
    });
});
