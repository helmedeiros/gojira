var svg = require('./svg');

var DEFAULTS = {
    width: 480,
    height: 240,
    buckets: 8,
    pad: 40,
    title: '',
    fill: '#0366d6',
    grid: '#d1d5da',
    text: '#586069'
};

function bucketize(values, count) {
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    var size = (max - min) / count;
    if (size === 0) {
        size = 1;
    }
    var counts = [];
    for (var i = 0; i < count; i++) {
        counts.push(0);
    }
    values.forEach(function (value) {
        var idx = Math.min(Math.floor((value - min) / size), count - 1);
        counts[idx] += 1;
    });
    return { min: min, max: max, size: size, counts: counts };
}

function empty(opts) {
    return svg.root(opts.width, opts.height, svg.text({
        x: opts.width / 2, y: opts.height / 2,
        text: 'no data', anchor: 'middle', font_size: 14, fill: opts.text
    }));
}

module.exports = {
    build: function (values, options) {
        var opts = Object.assign({}, DEFAULTS, options || {});
        if (!values || values.length === 0) {
            return empty(opts);
        }
        var data = bucketize(values, opts.buckets);
        var max_count = Math.max.apply(null, data.counts);
        var chart_left = opts.pad;
        var chart_right = opts.width - opts.pad / 2;
        var chart_top = opts.pad / 2;
        var chart_bottom = opts.height - opts.pad;
        var chart_w = chart_right - chart_left;
        var chart_h = chart_bottom - chart_top;
        var bar_w = chart_w / opts.buckets;
        var bars = data.counts.map(function (count, i) {
            var bar_h = max_count ? (count / max_count) * chart_h : 0;
            return svg.rect({
                x: chart_left + i * bar_w + 1,
                y: chart_bottom - bar_h,
                width: bar_w - 2,
                height: bar_h,
                fill: opts.fill
            });
        }).join('\n');
        var x_axis = svg.line({ x1: chart_left, y1: chart_bottom, x2: chart_right, y2: chart_bottom, stroke: opts.grid, stroke_width: 1 });
        var y_axis = svg.line({ x1: chart_left, y1: chart_top, x2: chart_left, y2: chart_bottom, stroke: opts.grid, stroke_width: 1 });
        var labels = [
            svg.text({ x: chart_left, y: chart_bottom + 16, text: String(data.min), anchor: 'start', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_right, y: chart_bottom + 16, text: String(data.max), anchor: 'end', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_left - 6, y: chart_top + 4, text: String(max_count), anchor: 'end', font_size: 11, fill: opts.text })
        ].join('\n');
        var title = opts.title
            ? svg.text({ x: opts.width / 2, y: 14, text: opts.title, anchor: 'middle', font_size: 12, fill: '#24292e' })
            : '';
        return svg.root(opts.width, opts.height, [title, x_axis, y_axis, bars, labels].filter(Boolean).join('\n'));
    }
};
