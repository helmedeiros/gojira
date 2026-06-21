var cfd = require('./charts/cfd');
var histogram = require('./charts/histogram');
var scatter = require('./charts/scatter');
var throughput_by_week = require('./charts/throughput_by_week');
var stacked_bars = require('./charts/stacked_bars');
var aging_wip = require('./charts/aging_wip');

var DAY_MS = 24 * 60 * 60 * 1000;

function lead_times(lines) {
    return lines
        .filter(function (l) { return typeof l.lead_time === 'number'; })
        .map(function (l) { return l.lead_time; });
}

function wall_clock_lead_times(lines) {
    return lines
        .filter(function (l) { return l.created_at && l.resolved_at; })
        .map(function (l) {
            var ms = new Date(l.resolved_at).getTime() - new Date(l.created_at).getTime();
            return Math.round(ms / DAY_MS);
        });
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

function last_entry_into_status(transitions, status) {
    for (var i = transitions.length - 1; i >= 0; i--) {
        if (transitions[i].to_status === status) {
            return transitions[i].at;
        }
    }
    return null;
}

function aging_rows(active_issues, now_ms) {
    return (active_issues || []).map(function (issue) {
        var status = issue.fields.status.name;
        var since_iso = null;
        if (Array.isArray(issue.transitions) && issue.transitions.length > 0) {
            since_iso = last_entry_into_status(issue.transitions, status);
        }
        if (!since_iso) {
            since_iso = issue.fields.created;
        }
        var since_ms = since_iso ? new Date(since_iso).getTime() : now_ms;
        var days = Math.round((now_ms - since_ms) / DAY_MS);
        return { label: issue.key, status: status, days: Math.max(days, 0) };
    });
}

module.exports = {
    build: function (lines, config, extras) {
        extras = extras || {};
        var legend = (config.csv_header_columns || '').split(',');
        var cfd_title = has_real_transitions(lines)
            ? 'Cumulative flow'
            : 'Cumulative flow (approximate)';
        var charts = [
            { name: 'cfd.svg', svg: cfd.build(lines, { legend: legend, title: cfd_title, width: 1040, height: 300 }) },
            { name: 'cycle_time_histogram.svg', svg: histogram.build(lead_times(lines), { title: 'Cycle time distribution (days)' }) },
            { name: 'cycle_time_scatter.svg', svg: scatter.build(scatter_points(lines), { title: 'Cycle time over time' }) },
            { name: 'lead_time_histogram.svg', svg: histogram.build(wall_clock_lead_times(lines), { title: 'Lead time distribution (days)' }) },
            { name: 'throughput_by_week.svg', svg: throughput_by_week.build(resolved_at(lines), { title: 'Throughput per ISO week' }) },
            { name: 'time_in_column.svg', svg: stacked_bars.build(stacked_rows(lines), { legend: legend, title: 'Time in each column' }) }
        ];
        if (Array.isArray(extras.active_issues) && extras.active_issues.length > 0) {
            var now_ms = typeof extras.now_ms === 'number' ? extras.now_ms : Date.now();
            charts.push({
                name: 'aging_wip.svg',
                svg: aging_wip.build(aging_rows(extras.active_issues, now_ms), { title: 'Aging WIP', width: 600, height: 320 })
            });
        }
        return charts;
    }
};
