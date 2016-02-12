var expect = require('chai').expect;
var over_under = require('../../lib/over_under');

describe('over_under', function () {
    describe('diff', function () {
        it('is zero when actual equals projected', function () {
            expect(over_under.diff(5, 5)).to.equal(0);
        });

        it('is positive when actual exceeds projected', function () {
            expect(over_under.diff(8, 5)).to.equal(3);
        });

        it('is negative when actual is under projected', function () {
            expect(over_under.diff(3, 5)).to.equal(-2);
        });
    });

    describe('ratio', function () {
        it('is 1 when actual equals projected', function () {
            expect(over_under.ratio(5, 5)).to.equal(1);
        });

        it('is greater than 1 when actual exceeds projected', function () {
            expect(over_under.ratio(8, 5)).to.equal(1.6);
        });

        it('is less than 1 when actual is under projected', function () {
            expect(over_under.ratio(3, 5)).to.equal(0.6);
        });

        it('returns 0 when projected is zero', function () {
            expect(over_under.ratio(5, 0)).to.equal(0);
        });
    });
});
