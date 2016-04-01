var expect = require('chai').expect;
var histogram = require('../../../lib/charts/histogram');

function count_occurrences(text, substring) {
    return text.split(substring).length - 1;
}

describe('charts/histogram', function () {
    it('emits a "no data" SVG for empty input', function () {
        var out = histogram.build([]);
        expect(out).to.contain('<svg');
        expect(out).to.contain('no data');
        expect(out).to.not.contain('<rect');
    });

    it('emits one rect per bucket', function () {
        var out = histogram.build([1, 2, 3, 4, 5, 6, 7, 8], { buckets: 4 });
        expect(count_occurrences(out, '<rect')).to.equal(4);
    });

    it('labels the min and max values on the x axis', function () {
        var out = histogram.build([2, 7, 11, 18, 25], { buckets: 5 });
        expect(out).to.contain('>2</text>');
        expect(out).to.contain('>25</text>');
    });

    it('labels the max bucket count on the y axis', function () {
        var out = histogram.build([1, 1, 1, 10, 10, 20], { buckets: 4 });
        expect(out).to.contain('>3</text>');
    });

    it('renders a title when provided', function () {
        var out = histogram.build([1, 2, 3], { title: 'Cycle time' });
        expect(out).to.contain('>Cycle time</text>');
    });

    it('uses the configured width and height in the viewBox', function () {
        var out = histogram.build([1, 2, 3], { width: 600, height: 300 });
        expect(out).to.contain('viewBox="0 0 600 300"');
    });

    it('handles a single repeated value without dividing by zero', function () {
        var out = histogram.build([5, 5, 5, 5], { buckets: 4 });
        expect(out).to.contain('<rect');
        expect(out).to.not.contain('NaN');
    });
});
