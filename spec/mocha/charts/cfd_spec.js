var expect = require('chai').expect;
var cfd = require('../../../lib/charts/cfd');

function count_occurrences(text, substring) {
    return text.split(substring).length - 1;
}

describe('charts/cfd', function () {
    var lines;
    var options;

    beforeEach(function () {
        lines = [
            { resolved_at: '2016-01-10T00:00:00Z', times_array: [2, 3, 1, 1, 0] },
            { resolved_at: '2016-01-15T00:00:00Z', times_array: [1, 4, 2, 1, 0] },
            { resolved_at: '2016-01-20T00:00:00Z', times_array: [3, 2, 1, 2, 0] }
        ];
        options = { legend: ['Backlog', 'In Progress', 'Code Review', 'QA', 'Done'] };
    });

    it('emits "no data" when no lines have resolved_at + times_array', function () {
        var out = cfd.build([], options);
        expect(out).to.contain('no data');
        expect(out).to.not.contain('<polygon');
    });

    it('emits one polygon band per column', function () {
        var out = cfd.build(lines, options);
        expect(count_occurrences(out, '<polygon')).to.equal(options.legend.length);
    });

    it('renders legend swatches with labels', function () {
        var out = cfd.build(lines, options);
        options.legend.forEach(function (label) {
            expect(out).to.contain('>' + label + '<');
        });
    });

    it('labels the first and last sample dates', function () {
        var out = cfd.build(lines, options);
        expect(out).to.match(/>20\d\d-\d\d-\d\d</);
    });

    it('skips lines that lack the required fields', function () {
        var mixed = lines.concat([{ times_array: [1, 1] }, { resolved_at: '2016-01-22T00:00:00Z' }]);
        var out = cfd.build(mixed, options);
        expect(count_occurrences(out, '<polygon')).to.equal(options.legend.length);
    });

    it('renders a title when provided', function () {
        var out = cfd.build(lines, Object.assign({}, options, { title: 'CFD' }));
        expect(out).to.contain('>CFD</text>');
    });
});
