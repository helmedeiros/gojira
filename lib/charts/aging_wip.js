var svg = require('./svg');

var PALETTE = ['#0366d6', '#f9826c', '#6f42c1', '#28a745', '#ffd33d', '#959da5', '#005cc5', '#d1d5da'];

var DEFAULTS = {
    width: 600,
    height: 320,
    row_height: 22,
    label_width: 110,
    pad: 20,
    title: '',
    text: '#586069'
};

function empty(opts) {
    return svg.root(opts.width, opts.height, svg.text({
        x: opts.width / 2, y: opts.height / 2,
        text: 'no active items', anchor: 'middle', font_size: 14, fill: opts.text
    }));
}

function distinct_statuses(rows) {
    var seen = [];
    rows.forEach(function (row) {
        if (seen.indexOf(row.status) === -1) {
            seen.push(row.status);
        }
    });
    return seen;
}

module.exports = {
    build: function (rows, options) {
        var opts = Object.assign({}, DEFAULTS, options || {});
        if (!rows || rows.length === 0) {
            return empty(opts);
        }
        var sorted = rows.slice().sort(function (a, b) { return b.days - a.days; });
        var max_days = sorted[0].days || 1;

        var statuses = distinct_statuses(sorted);
        var palette = {};
        statuses.forEach(function (status, idx) { palette[status] = PALETTE[idx % PALETTE.length]; });

        var bar_left = opts.pad + opts.label_width;
        var bar_right = opts.width - opts.pad - 32;
        var bar_max_w = bar_right - bar_left;
        var rows_top = opts.pad + (opts.title ? 20 : 0);

        var row_elements = sorted.map(function (row, idx) {
            var y = rows_top + idx * opts.row_height;
            var label = svg.text({
                x: bar_left - 8, y: y + opts.row_height / 2 + 4,
                text: row.label, anchor: 'end', font_size: 11, fill: opts.text,
                font_family: 'SFMono-Regular, Menlo, monospace'
            });
            var bar_w = (row.days / max_days) * bar_max_w;
            var bar = svg.rect({
                x: bar_left,
                y: y + 3,
                width: bar_w,
                height: opts.row_height - 6,
                fill: palette[row.status]
            });
            var days_label = svg.text({
                x: bar_left + bar_w + 4, y: y + opts.row_height / 2 + 4,
                text: row.days + 'd', anchor: 'start', font_size: 11, fill: opts.text
            });
            return label + '\n' + bar + '\n' + days_label;
        }).join('\n');

        var legend_y = rows_top + sorted.length * opts.row_height + 8;
        var legend_elements = statuses.map(function (status, idx) {
            var lx = bar_left + idx * 110;
            return svg.rect({ x: lx, y: legend_y, width: 12, height: 12, fill: palette[status] }) +
                svg.text({ x: lx + 16, y: legend_y + 10, text: status, anchor: 'start', font_size: 11, fill: opts.text });
        }).join('\n');

        var title = opts.title
            ? svg.text({ x: opts.width / 2, y: 14, text: opts.title, anchor: 'middle', font_size: 12, fill: '#24292e' })
            : '';

        return svg.root(opts.width, opts.height, [title, row_elements, legend_elements].filter(Boolean).join('\n'));
    }
};
