var expect = require('chai').expect;
var aging_wip = require('../../../lib/charts/aging_wip');

describe('charts/aging_wip', function () {
    var rows;

    beforeEach(function () {
        rows = [
            { label: 'DEMO-501', days: 12, status: 'In Progress' },
            { label: 'DEMO-502', days: 4, status: 'Code Review' },
            { label: 'DEMO-503', days: 20, status: 'In Progress' },
            { label: 'DEMO-504', days: 2, status: 'QA' }
        ];
    });

    it('emits a placeholder when there are no active items', function () {
        var out = aging_wip.build([]);
        expect(out).to.contain('no active items');
        expect(out).to.not.contain('<rect');
    });

    it('emits one bar per active item', function () {
        var out = aging_wip.build(rows);
        var bars = (out.match(/<rect[^/]*?height="\d+"/g) || []).filter(function (m) {
            return !m.includes('height="12"');
        });
        expect(bars).to.have.length(rows.length);
    });

    it('renders the issue key as the row label', function () {
        var out = aging_wip.build(rows);
        rows.forEach(function (r) {
            expect(out).to.contain('>' + r.label + '<');
        });
    });

    it('annotates each bar with the day count', function () {
        var out = aging_wip.build(rows);
        rows.forEach(function (r) {
            expect(out).to.contain('>' + r.days + 'd<');
        });
    });

    it('sorts rows from oldest to youngest', function () {
        var out = aging_wip.build(rows);
        var order = ['DEMO-503', 'DEMO-501', 'DEMO-502', 'DEMO-504'];
        var positions = order.map(function (key) { return out.indexOf('>' + key + '<'); });
        for (var i = 1; i < positions.length; i++) {
            expect(positions[i]).to.be.greaterThan(positions[i - 1]);
        }
    });

    it('renders a legend swatch per distinct status', function () {
        var out = aging_wip.build(rows);
        ['In Progress', 'Code Review', 'QA'].forEach(function (status) {
            expect(out).to.contain('>' + status + '<');
        });
    });

    it('renders a title when provided', function () {
        var out = aging_wip.build(rows, { title: 'Aging WIP' });
        expect(out).to.contain('>Aging WIP</text>');
    });

    it('uses the configured width/height', function () {
        var out = aging_wip.build(rows, { width: 700, height: 400 });
        expect(out).to.contain('viewBox="0 0 700 400"');
    });
});
