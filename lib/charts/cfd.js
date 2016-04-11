var svg = require('./svg');
var transitions = require('../transitions');

var PALETTE = ['#d1d5da', '#0366d6', '#f9826c', '#6f42c1', '#28a745', '#ffd33d', '#959da5', '#005cc5'];

var DEFAULTS = {
    width: 600,
    height: 280,
    pad: 40,
    samples: 30,
    title: '',
    grid: '#d1d5da',
    text: '#586069'
};

function empty(opts) {
    return svg.root(opts.width, opts.height, svg.text({
        x: opts.width / 2, y: opts.height / 2,
        text: 'no data', anchor: 'middle', font_size: 14, fill: opts.text
    }));
}

function format_date(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

function sample_counts(entries, columns_count, sample_count) {
    var all_times = entries.reduce(function (acc, t) { return acc.concat(t); }, []);
    var min_ms = Math.min.apply(null, all_times);
    var max_ms = Math.max.apply(null, all_times);
    if (min_ms === max_ms) {
        max_ms = min_ms + 1;
    }
    var step = (max_ms - min_ms) / sample_count;
    var samples = [];
    for (var s = 0; s <= sample_count; s++) {
        var t = min_ms + s * step;
        var counts = [];
        for (var i = 0; i < columns_count; i++) {
            counts.push(0);
        }
        entries.forEach(function (entered) {
            for (var c = 0; c < entered.length; c++) {
                if (entered[c] <= t) {
                    counts[c] += 1;
                }
            }
        });
        samples.push({ t: t, counts: counts });
    }
    return { samples: samples, min: min_ms, max: max_ms };
}

function band_polygon(samples, x_at, y_at, top_index, bottom_index) {
    var top_points = samples.map(function (s) {
        return x_at(s.t) + ',' + y_at(s.counts[top_index]);
    });
    var bottom_points = samples.map(function (s) {
        var bottom_count = bottom_index === null ? 0 : s.counts[bottom_index];
        return x_at(s.t) + ',' + y_at(bottom_count);
    }).reverse();
    return top_points.concat(bottom_points).join(' ');
}

module.exports = {
    build: function (lines, options) {
        var opts = Object.assign({}, DEFAULTS, options || {});
        var entries = transitions.for_lines(lines);
        if (entries.length === 0) {
            return empty(opts);
        }
        var legend = opts.legend || [];
        var columns_count = legend.length || entries[0].length;
        var data = sample_counts(entries, columns_count, opts.samples);
        var max_count = data.samples.reduce(function (max, s) {
            return Math.max(max, s.counts[0]);
        }, 0) || 1;

        var chart_left = opts.pad;
        var chart_right = opts.width - opts.pad / 2;
        var chart_top = opts.pad / 2 + (opts.title ? 10 : 0);
        var chart_bottom = opts.height - opts.pad - (legend.length ? 20 : 0);
        var chart_w = chart_right - chart_left;
        var chart_h = chart_bottom - chart_top;
        var x_at = function (t) {
            return chart_left + ((t - data.min) / (data.max - data.min)) * chart_w;
        };
        var y_at = function (count) {
            return chart_bottom - (count / max_count) * chart_h;
        };

        var bands = [];
        for (var c = 0; c < columns_count; c++) {
            var bottom = c === columns_count - 1 ? null : c + 1;
            var points = band_polygon(data.samples, x_at, y_at, c, bottom);
            bands.push('<polygon points="' + points + '" fill="' + svg.escape(PALETTE[c % PALETTE.length]) + '" fill-opacity="0.85"/>');
        }

        var x_axis = svg.line({ x1: chart_left, y1: chart_bottom, x2: chart_right, y2: chart_bottom, stroke: opts.grid, stroke_width: 1 });
        var y_axis = svg.line({ x1: chart_left, y1: chart_top, x2: chart_left, y2: chart_bottom, stroke: opts.grid, stroke_width: 1 });

        var labels = [
            svg.text({ x: chart_left, y: chart_bottom + 16, text: format_date(data.min), anchor: 'start', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_right, y: chart_bottom + 16, text: format_date(data.max), anchor: 'end', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_left - 6, y: chart_top + 4, text: String(max_count), anchor: 'end', font_size: 11, fill: opts.text })
        ];

        var legend_y = chart_bottom + 36;
        var legend_swatches = legend.map(function (label, idx) {
            var lx = chart_left + idx * 100;
            return svg.rect({ x: lx, y: legend_y, width: 12, height: 12, fill: PALETTE[idx % PALETTE.length] }) +
                svg.text({ x: lx + 16, y: legend_y + 10, text: label, anchor: 'start', font_size: 11, fill: opts.text });
        });

        var title = opts.title
            ? svg.text({ x: opts.width / 2, y: 14, text: opts.title, anchor: 'middle', font_size: 12, fill: '#24292e' })
            : '';

        return svg.root(opts.width, opts.height,
            [title].concat(bands).concat([x_axis, y_axis]).concat(labels).concat(legend_swatches).filter(Boolean).join('\n')
        );
    }
};
