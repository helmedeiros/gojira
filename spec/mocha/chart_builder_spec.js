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

    it('marks the CFD as approximate when no line has real transitions', function () {
        var cfd_chart = chart_builder.build(lines, config).find(function (c) { return c.name === 'cfd.svg'; });
        expect(cfd_chart.svg).to.contain('Cumulative flow (approximate)');
    });

    it('drops the approximate suffix when at least one line has real transitions', function () {
        var enriched = lines.map(function (l) { return l; });
        enriched[0] = Object.assign({}, lines[0], {
            transitions: [
                { at: '2016-01-08T00:00:00Z', to_status: 'Backlog' },
                { at: '2016-01-09T00:00:00Z', to_status: 'In Progress' },
                { at: '2016-01-10T00:00:00Z', to_status: 'Done' }
            ]
        });
        var cfd_chart = chart_builder.build(enriched, config).find(function (c) { return c.name === 'cfd.svg'; });
        expect(cfd_chart.svg).to.contain('Cumulative flow<');
        expect(cfd_chart.svg).to.not.contain('approximate');
    });

    it('omits aging_wip when no active_issues are provided', function () {
        var charts = chart_builder.build(lines, config);
        expect(charts.find(function (c) { return c.name === 'aging_wip.svg'; })).to.be.undefined;
    });

    it('appends an aging_wip chart when active_issues are present', function () {
        var DAY = 24 * 60 * 60 * 1000;
        var now_ms = Date.UTC(2016, 1, 1);
        var active_issues = [
            {
                key: 'DEMO-501',
                fields: { status: { name: 'In Progress' }, created: new Date(now_ms - 5 * DAY).toISOString() },
                transitions: [
                    { at: new Date(now_ms - 5 * DAY).toISOString(), to_status: 'Backlog' },
                    { at: new Date(now_ms - 3 * DAY).toISOString(), to_status: 'In Progress' }
                ]
            },
            {
                key: 'DEMO-502',
                fields: { status: { name: 'Code Review' }, created: new Date(now_ms - 8 * DAY).toISOString() }
            }
        ];
        var charts = chart_builder.build(lines, config, { active_issues: active_issues, now_ms: now_ms });
        var aging = charts.find(function (c) { return c.name === 'aging_wip.svg'; });
        expect(aging).to.exist;
        expect(aging.svg).to.contain('Aging WIP');
        expect(aging.svg).to.contain('DEMO-501');
        expect(aging.svg).to.contain('DEMO-502');
        expect(aging.svg).to.contain('>3d<');
        expect(aging.svg).to.contain('>8d<');
    });
});
