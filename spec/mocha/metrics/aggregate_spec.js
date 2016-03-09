var expect = require('chai').expect;
var aggregate = require('../../../lib/metrics/aggregate');

describe('aggregate.summarize', function () {
    it('returns zeroed summary for empty input', function () {
        var summary = aggregate.summarize([]);
        expect(summary).to.eql({ count: 0, min: 0, max: 0, mean: 0, median: 0, p85: 0, p95: 0 });
    });

    it('returns zeroed summary for null input', function () {
        var summary = aggregate.summarize(null);
        expect(summary.count).to.equal(0);
    });

    it('reports count, min and max', function () {
        var summary = aggregate.summarize([5, 1, 8, 3, 6]);
        expect(summary.count).to.equal(5);
        expect(summary.min).to.equal(1);
        expect(summary.max).to.equal(8);
    });

    it('computes the arithmetic mean', function () {
        expect(aggregate.summarize([2, 4, 6]).mean).to.equal(4);
    });

    it('computes the median', function () {
        expect(aggregate.summarize([1, 2, 3, 4, 5]).median).to.equal(3);
    });

    it('computes p85 and p95', function () {
        var summary = aggregate.summarize([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(summary.p85).to.be.closeTo(8.65, 0.0001);
        expect(summary.p95).to.be.closeTo(9.55, 0.0001);
    });
});
