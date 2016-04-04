var svg = require('./svg');

var WEEK_MS = 7 * 24 * 60 * 60 * 1000;

var DEFAULTS = {
    width: 480,
    height: 240,
    pad: 40,
    title: '',
    fill: '#0366d6',
    grid: '#d1d5da',
    text: '#586069'
};

function to_ms(date) {
    if (date == null) {
        return null;
    }
    if (typeof date === 'number') {
        return date;
    }
    return new Date(date).getTime();
}

function week_start(ms) {
    var d = new Date(ms);
    var day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() - day + 1);
    d.setUTCHours(0, 0, 0, 0);
    return d.getTime();
}

function format_date(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

function bucket(timestamps) {
    if (timestamps.length === 0) {
        return [];
    }
    var min_week = week_start(Math.min.apply(null, timestamps));
    var max_week = week_start(Math.max.apply(null, timestamps));
    var counts = {};
    timestamps.forEach(function (ts) {
        var key = week_start(ts);
        counts[key] = (counts[key] || 0) + 1;
    });
    var buckets = [];
    for (var week = min_week; week <= max_week; week += WEEK_MS) {
        buckets.push({ week: week, count: counts[week] || 0 });
    }
    return buckets;
}

function empty(opts) {
    return svg.root(opts.width, opts.height, svg.text({
        x: opts.width / 2, y: opts.height / 2,
        text: 'no data', anchor: 'middle', font_size: 14, fill: opts.text
    }));
}

module.exports = {
    build: function (dates, options) {
        var opts = Object.assign({}, DEFAULTS, options || {});
        var timestamps = (dates || []).map(to_ms).filter(function (ts) { return ts !== null; });
        if (timestamps.length === 0) {
            return empty(opts);
        }
        var buckets = bucket(timestamps);
        var max_count = buckets.reduce(function (max, b) { return Math.max(max, b.count); }, 0);
        var chart_left = opts.pad;
        var chart_right = opts.width - opts.pad / 2;
        var chart_top = opts.pad / 2;
        var chart_bottom = opts.height - opts.pad;
        var chart_w = chart_right - chart_left;
        var chart_h = chart_bottom - chart_top;
        var bar_w = chart_w / buckets.length;
        var bars = buckets.map(function (b, i) {
            var h = max_count ? (b.count / max_count) * chart_h : 0;
            return svg.rect({
                x: chart_left + i * bar_w + 1,
                y: chart_bottom - h,
                width: bar_w - 2,
                height: h,
                fill: opts.fill
            });
        }).join('\n');
        var x_axis = svg.line({ x1: chart_left, y1: chart_bottom, x2: chart_right, y2: chart_bottom, stroke: opts.grid, stroke_width: 1 });
        var y_axis = svg.line({ x1: chart_left, y1: chart_top, x2: chart_left, y2: chart_bottom, stroke: opts.grid, stroke_width: 1 });
        var labels = [
            svg.text({ x: chart_left, y: chart_bottom + 16, text: format_date(buckets[0].week), anchor: 'start', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_right, y: chart_bottom + 16, text: format_date(buckets[buckets.length - 1].week), anchor: 'end', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_left - 6, y: chart_top + 4, text: String(max_count), anchor: 'end', font_size: 11, fill: opts.text })
        ].join('\n');
        var title = opts.title
            ? svg.text({ x: opts.width / 2, y: 14, text: opts.title, anchor: 'middle', font_size: 12, fill: '#24292e' })
            : '';
        return svg.root(opts.width, opts.height, [title, x_axis, y_axis, bars, labels].filter(Boolean).join('\n'));
    }
};
