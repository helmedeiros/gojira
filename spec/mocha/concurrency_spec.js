var expect = require('chai').expect;
var concurrency = require('../../lib/concurrency');

describe('concurrency.map_with_limit', function () {
    it('returns an empty array for empty input', function () {
        return concurrency.map_with_limit([], 4, function () { return 1; }).then(function (out) {
            expect(out).to.eql([]);
        });
    });

    it('returns null/undefined input as empty', function () {
        return concurrency.map_with_limit(null, 4, function () { return 1; }).then(function (out) {
            expect(out).to.eql([]);
        });
    });

    it('preserves order of results', function () {
        var items = [1, 2, 3, 4, 5];
        return concurrency.map_with_limit(items, 2, function (n) {
            return new Promise(function (resolve) {
                setTimeout(function () { resolve(n * 2); }, 5);
            });
        }).then(function (out) {
            expect(out).to.eql([2, 4, 6, 8, 10]);
        });
    });

    it('never runs more than `limit` mappers at once', function () {
        var active = 0;
        var max_active = 0;
        var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return concurrency.map_with_limit(items, 3, function () {
            active += 1;
            if (active > max_active) {
                max_active = active;
            }
            return new Promise(function (resolve) {
                setTimeout(function () { active -= 1; resolve(); }, 5);
            });
        }).then(function () {
            expect(max_active).to.be.at.most(3);
        });
    });

    it('works with limit greater than items length', function () {
        var items = [1, 2];
        return concurrency.map_with_limit(items, 99, function (n) {
            return Promise.resolve(n);
        }).then(function (out) {
            expect(out).to.eql([1, 2]);
        });
    });
});
