var expect = require('chai').expect;
var throughput = require('../../../lib/metrics/throughput');

describe('throughput', function () {
    it('returns 0 for missing input', function () {
        expect(throughput.compute(null)).to.equal(0);
        expect(throughput.compute(undefined)).to.equal(0);
    });

    it('returns 0 for empty array', function () {
        expect(throughput.compute([])).to.equal(0);
    });

    it('returns the count of completed issues', function () {
        expect(throughput.compute([{}, {}, {}])).to.equal(3);
    });
});
