function asc(a, b) {
    return a - b;
}

module.exports = {
    compute: function (values, p) {
        if (!values || values.length === 0) {
            return 0;
        }
        if (p <= 0) {
            return Math.min.apply(null, values);
        }
        if (p >= 1) {
            return Math.max.apply(null, values);
        }
        var sorted = values.slice().sort(asc);
        var rank = p * (sorted.length - 1);
        var lower = Math.floor(rank);
        var upper = Math.ceil(rank);
        if (lower === upper) {
            return sorted[lower];
        }
        var fraction = rank - lower;
        return sorted[lower] + (sorted[upper] - sorted[lower]) * fraction;
    }
};
