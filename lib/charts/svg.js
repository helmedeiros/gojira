function escape(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function attrs(map) {
    return Object.keys(map)
        .filter(function (key) { return map[key] !== undefined && map[key] !== null; })
        .map(function (key) { return key + '="' + escape(map[key]) + '"'; })
        .join(' ');
}

module.exports = {
    escape: escape,
    root: function (width, height, body) {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + height +
            '" width="' + width + '" height="' + height + '">\n' + body + '\n</svg>';
    },
    rect: function (opts) {
        return '<rect ' + attrs({
            x: opts.x, y: opts.y, width: opts.width, height: opts.height,
            fill: opts.fill, stroke: opts.stroke
        }) + '/>';
    },
    line: function (opts) {
        return '<line ' + attrs({
            x1: opts.x1, y1: opts.y1, x2: opts.x2, y2: opts.y2,
            stroke: opts.stroke, 'stroke-width': opts.stroke_width
        }) + '/>';
    },
    text: function (opts) {
        return '<text ' + attrs({
            x: opts.x, y: opts.y, fill: opts.fill,
            'text-anchor': opts.anchor, 'font-size': opts.font_size,
            'font-family': opts.font_family
        }) + '>' + escape(opts.text) + '</text>';
    }
};
