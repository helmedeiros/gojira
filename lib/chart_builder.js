var cfd = require('./charts/cfd');
var histogram = require('./charts/histogram');
var scatter = require('./charts/scatter');
var throughput_by_week = require('./charts/throughput_by_week');
var stacked_bars = require('./charts/stacked_bars');

function lead_times(lines) {
    return lines
        .filter(function (l) { return typeof l.lead_time === 'number'; })
        .map(function (l) { return l.lead_time; });
}

function resolved_at(lines) {
    return lines.filter(function (l) { return l.resolved_at; })
        .map(function (l) { return l.resolved_at; });
}

function scatter_points(lines) {
    return lines
        .filter(function (l) { return l.resolved_at && typeof l.lead_time === 'number'; })
        .map(function (l) { return { x: l.resolved_at, y: l.lead_time }; });
}

function stacked_rows(lines) {
    return lines
        .filter(function (l) { return Array.isArray(l.times_array); })
        .map(function (l) { return { label: l.key, values: l.times_array }; });
}

function has_real_transitions(lines) {
    return lines.some(function (l) { return Array.isArray(l.transitions) && l.transitions.length > 0; });
}

module.exports = {
    build: function (lines, config) {
        var legend = (config.csv_header_columns || '').split(',');
        var cfd_title = has_real_transitions(lines)
            ? 'Cumulative flow'
            : 'Cumulative flow (approximate)';
        return [
            { name: 'cfd.svg', svg: cfd.build(lines, { legend: legend, title: cfd_title }) },
            { name: 'cycle_time_histogram.svg', svg: histogram.build(lead_times(lines), { title: 'Cycle time distribution (days)' }) },
            { name: 'cycle_time_scatter.svg', svg: scatter.build(scatter_points(lines), { title: 'Cycle time over time' }) },
            { name: 'throughput_by_week.svg', svg: throughput_by_week.build(resolved_at(lines), { title: 'Throughput per ISO week' }) },
            { name: 'time_in_column.svg', svg: stacked_bars.build(stacked_rows(lines), { legend: legend, title: 'Time in each column' }) }
        ];
    }
};
