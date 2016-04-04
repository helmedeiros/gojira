var expect = require('chai').expect;
var scatter = require('../../../lib/charts/scatter');

function count_occurrences(text, substring) {
    return text.split(substring).length - 1;
}

describe('charts/scatter', function () {
    var points;

    beforeEach(function () {
        points = [
            { x: '2016-01-05T10:00:00.000Z', y: 4 },
            { x: '2016-01-12T12:00:00.000Z', y: 8 },
            { x: '2016-01-19T15:00:00.000Z', y: 2 },
            { x: '2016-01-26T09:00:00.000Z', y: 12 }
        ];
    });

    it('emits "no data" for empty input', function () {
        var out = scatter.build([]);
        expect(out).to.contain('no data');
        expect(out).to.not.contain('<circle');
    });

    it('emits one circle per data point', function () {
        var out = scatter.build(points);
        expect(count_occurrences(out, '<circle')).to.equal(4);
    });

    it('labels the first and last dates on the x axis', function () {
        var out = scatter.build(points);
        expect(out).to.contain('>2016-01-05<');
        expect(out).to.contain('>2016-01-26<');
    });

    it('labels the max y value', function () {
        var out = scatter.build(points);
        expect(out).to.contain('>12</text>');
    });

    it('drops points missing y or x', function () {
        points.push({ x: null, y: 7 });
        points.push({ x: '2016-02-01', y: NaN });
        var out = scatter.build(points);
        expect(count_occurrences(out, '<circle')).to.equal(4);
    });

    it('accepts numeric ms timestamps', function () {
        var ms_points = [
            { x: Date.UTC(2016, 0, 5), y: 1 },
            { x: Date.UTC(2016, 0, 10), y: 3 }
        ];
        var out = scatter.build(ms_points);
        expect(count_occurrences(out, '<circle')).to.equal(2);
    });

    it('renders a title when provided', function () {
        var out = scatter.build(points, { title: 'Cycle time over time' });
        expect(out).to.contain('>Cycle time over time</text>');
    });
});
