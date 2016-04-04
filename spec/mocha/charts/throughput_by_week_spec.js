var expect = require('chai').expect;
var throughput = require('../../../lib/charts/throughput_by_week');

function count_occurrences(text, substring) {
    return text.split(substring).length - 1;
}

describe('charts/throughput_by_week', function () {
    it('emits "no data" for empty input', function () {
        var out = throughput.build([]);
        expect(out).to.contain('no data');
        expect(out).to.not.contain('<rect');
    });

    it('emits one bar per ISO week between first and last date', function () {
        var dates = [
            '2016-01-04T10:00:00Z',
            '2016-01-05T10:00:00Z',
            '2016-01-18T10:00:00Z'
        ];
        var out = throughput.build(dates);
        expect(count_occurrences(out, '<rect')).to.equal(3);
    });

    it('counts items in the same week into the same bar', function () {
        var dates = [
            '2016-01-04T10:00:00Z',
            '2016-01-05T10:00:00Z',
            '2016-01-07T10:00:00Z'
        ];
        var out = throughput.build(dates);
        expect(count_occurrences(out, '<rect')).to.equal(1);
        expect(out).to.contain('>3</text>');
    });

    it('labels the first and last week dates', function () {
        var out = throughput.build(['2016-01-04T10:00:00Z', '2016-01-25T10:00:00Z']);
        expect(out).to.contain('>2016-01-04<');
        expect(out).to.contain('>2016-01-25<');
    });

    it('renders a title when provided', function () {
        var out = throughput.build(['2016-01-04T10:00:00Z'], { title: 'Throughput' });
        expect(out).to.contain('>Throughput</text>');
    });

    it('accepts numeric ms timestamps', function () {
        var out = throughput.build([Date.UTC(2016, 0, 4), Date.UTC(2016, 0, 11)]);
        expect(count_occurrences(out, '<rect')).to.equal(2);
    });

    it('drops null entries', function () {
        var out = throughput.build([null, '2016-01-04T10:00:00Z', undefined]);
        expect(count_occurrences(out, '<rect')).to.equal(1);
    });
});
