var svg = require('./svg');

var DEFAULTS = {
    width: 480,
    height: 240,
    pad: 40,
    radius: 4,
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

function format_date(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

function empty(opts) {
    return svg.root(opts.width, opts.height, svg.text({
        x: opts.width / 2, y: opts.height / 2,
        text: 'no data', anchor: 'middle', font_size: 14, fill: opts.text
    }));
}

module.exports = {
    build: function (points, options) {
        var opts = Object.assign({}, DEFAULTS, options || {});
        var clean = (points || [])
            .map(function (p) { return { x: to_ms(p.x), y: p.y }; })
            .filter(function (p) { return p.x !== null && typeof p.y === 'number' && !isNaN(p.y); });
        if (clean.length === 0) {
            return empty(opts);
        }
        var xs = clean.map(function (p) { return p.x; });
        var ys = clean.map(function (p) { return p.y; });
        var x_min = Math.min.apply(null, xs);
        var x_max = Math.max.apply(null, xs);
        var y_min = 0;
        var y_max = Math.max.apply(null, ys);
        var x_span = x_max - x_min || 1;
        var y_span = y_max - y_min || 1;
        var chart_left = opts.pad;
        var chart_right = opts.width - opts.pad / 2;
        var chart_top = opts.pad / 2;
        var chart_bottom = opts.height - opts.pad;
        var chart_w = chart_right - chart_left;
        var chart_h = chart_bottom - chart_top;
        var circles = clean.map(function (p) {
            var cx = chart_left + ((p.x - x_min) / x_span) * chart_w;
            var cy = chart_bottom - ((p.y - y_min) / y_span) * chart_h;
            return '<circle cx="' + cx + '" cy="' + cy + '" r="' + opts.radius + '" fill="' + svg.escape(opts.fill) + '" fill-opacity="0.7"/>';
        }).join('\n');
        var x_axis = svg.line({ x1: chart_left, y1: chart_bottom, x2: chart_right, y2: chart_bottom, stroke: opts.grid, stroke_width: 1 });
        var y_axis = svg.line({ x1: chart_left, y1: chart_top, x2: chart_left, y2: chart_bottom, stroke: opts.grid, stroke_width: 1 });
        var labels = [
            svg.text({ x: chart_left, y: chart_bottom + 16, text: format_date(x_min), anchor: 'start', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_right, y: chart_bottom + 16, text: format_date(x_max), anchor: 'end', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_left - 6, y: chart_top + 4, text: String(y_max), anchor: 'end', font_size: 11, fill: opts.text }),
            svg.text({ x: chart_left - 6, y: chart_bottom + 4, text: '0', anchor: 'end', font_size: 11, fill: opts.text })
        ].join('\n');
        var title = opts.title
            ? svg.text({ x: opts.width / 2, y: 14, text: opts.title, anchor: 'middle', font_size: 12, fill: '#24292e' })
            : '';
        return svg.root(opts.width, opts.height, [title, x_axis, y_axis, circles, labels].filter(Boolean).join('\n'));
    }
};
