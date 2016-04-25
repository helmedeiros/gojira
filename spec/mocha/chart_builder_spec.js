var expect = require('chai').expect;
var chart_builder = require('../../lib/chart_builder');

describe('chart_builder', function () {
    var config;
    var lines;

    beforeEach(function () {
        config = { csv_header_columns: 'Backlog,In Progress,Done' };
        lines = [
            {
                key: 'DEMO-1',
                lead_time: 8,
                resolved_at: '2016-01-10T00:00:00Z',
                times_array: [1, 8, 0]
            },
            {
                key: 'DEMO-2',
                lead_time: 4,
                resolved_at: '2016-01-15T00:00:00Z',
                times_array: [2, 4, 0]
            }
        ];
    });

    it('returns one file per chart', function () {
        var charts = chart_builder.build(lines, config);
        expect(charts).to.have.length(5);
    });

    it('emits expected file names', function () {
        var names = chart_builder.build(lines, config).map(function (c) { return c.name; });
        expect(names).to.include('cfd.svg');
        expect(names).to.include('cycle_time_histogram.svg');
        expect(names).to.include('cycle_time_scatter.svg');
        expect(names).to.include('throughput_by_week.svg');
        expect(names).to.include('time_in_column.svg');
    });

    it('each entry has a non-empty SVG string', function () {
        chart_builder.build(lines, config).forEach(function (chart) {
            expect(chart.svg).to.be.a('string');
            expect(chart.svg).to.contain('<svg');
            expect(chart.svg.length).to.be.greaterThan(50);
        });
    });

    it('still produces all charts when lines are sparse', function () {
        var charts = chart_builder.build([{ key: 'X' }], config);
        expect(charts).to.have.length(5);
        charts.forEach(function (chart) {
            expect(chart.svg).to.contain('<svg');
        });
    });
});
