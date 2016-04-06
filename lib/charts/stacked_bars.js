var svg = require('./svg');

var PALETTE = ['#d1d5da', '#0366d6', '#f9826c', '#6f42c1', '#28a745', '#ffd33d', '#959da5', '#005cc5'];

var DEFAULTS = {
    width: 600,
    height: 320,
    row_height: 22,
    label_width: 100,
    pad: 20,
    legend_pad: 20,
    title: '',
    text: '#586069'
};

function empty(opts) {
    return svg.root(opts.width, opts.height, svg.text({
        x: opts.width / 2, y: opts.height / 2,
        text: 'no data', anchor: 'middle', font_size: 14, fill: opts.text
    }));
}

function sum(values) {
    return values.reduce(function (a, b) { return a + b; }, 0);
}

module.exports = {
    build: function (rows, options) {
        var opts = Object.assign({}, DEFAULTS, options || {});
        var legend = (opts.legend || []);
        if (!rows || rows.length === 0) {
            return empty(opts);
        }
        var totals = rows.map(function (r) { return sum(r.values); });
        var max_total = Math.max.apply(null, totals) || 1;
        var bar_left = opts.pad + opts.label_width;
        var bar_right = opts.width - opts.pad;
        var bar_max_w = bar_right - bar_left;
        var rows_top = opts.pad + (opts.title ? 20 : 0);

        var row_elements = rows.map(function (row, i) {
            var y = rows_top + i * opts.row_height;
            var label = svg.text({
                x: bar_left - 8, y: y + opts.row_height / 2 + 4,
                text: row.label, anchor: 'end', font_size: 11, fill: opts.text,
                font_family: 'SFMono-Regular, Menlo, monospace'
            });
            var offset_x = 0;
            var segments = row.values.map(function (value, idx) {
                var w = (value / max_total) * bar_max_w;
                var seg = svg.rect({
                    x: bar_left + offset_x,
                    y: y + 2,
                    width: w,
                    height: opts.row_height - 6,
                    fill: PALETTE[idx % PALETTE.length]
                });
                offset_x += w;
                return seg;
            }).join('');
            return label + '\n' + segments;
        }).join('\n');

        var legend_y = rows_top + rows.length * opts.row_height + opts.legend_pad;
        var legend_elements = legend.map(function (label, idx) {
            var lx = bar_left + idx * 110;
            return svg.rect({ x: lx, y: legend_y, width: 12, height: 12, fill: PALETTE[idx % PALETTE.length] }) +
                svg.text({ x: lx + 16, y: legend_y + 10, text: label, anchor: 'start', font_size: 11, fill: opts.text });
        }).join('\n');

        var title = opts.title
            ? svg.text({ x: opts.width / 2, y: 14, text: opts.title, anchor: 'middle', font_size: 12, fill: '#24292e' })
            : '';

        return svg.root(opts.width, opts.height, [title, row_elements, legend_elements].filter(Boolean).join('\n'));
    }
};
