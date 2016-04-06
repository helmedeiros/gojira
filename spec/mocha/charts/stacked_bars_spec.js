var expect = require('chai').expect;
var stacked = require('../../../lib/charts/stacked_bars');

function count_occurrences(text, substring) {
    return text.split(substring).length - 1;
}

describe('charts/stacked_bars', function () {
    var rows;
    var options;

    beforeEach(function () {
        rows = [
            { label: 'DEMO-1', values: [1, 2, 3] },
            { label: 'DEMO-2', values: [4, 1, 5] },
            { label: 'DEMO-3', values: [2, 2, 2] }
        ];
        options = { legend: ['Backlog', 'In Progress', 'Done'] };
    });

    it('emits "no data" for empty input', function () {
        var out = stacked.build([], options);
        expect(out).to.contain('no data');
        expect(out).to.not.contain('<rect');
    });

    it('renders one row per item with the issue label', function () {
        var out = stacked.build(rows, options);
        expect(out).to.contain('>DEMO-1</text>');
        expect(out).to.contain('>DEMO-2</text>');
        expect(out).to.contain('>DEMO-3</text>');
    });

    it('renders one segment per value plus one swatch per legend entry', function () {
        var out = stacked.build(rows, options);
        var expected = rows.length * rows[0].values.length + options.legend.length;
        expect(count_occurrences(out, '<rect')).to.equal(expected);
    });

    it('renders the legend labels', function () {
        var out = stacked.build(rows, options);
        expect(out).to.contain('>Backlog</text>');
        expect(out).to.contain('>In Progress</text>');
        expect(out).to.contain('>Done</text>');
    });

    it('renders a title when provided', function () {
        var out = stacked.build(rows, Object.assign({}, options, { title: 'Time in column' }));
        expect(out).to.contain('>Time in column</text>');
    });

    it('uses the configured width and height', function () {
        var out = stacked.build(rows, Object.assign({}, options, { width: 720, height: 480 }));
        expect(out).to.contain('viewBox="0 0 720 480"');
    });
});
