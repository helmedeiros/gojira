var percentile = require('./percentile');

function mean(values) {
    var sum = values.reduce(function (a, b) { return a + b; }, 0);
    return sum / values.length;
}

module.exports = {
    summarize: function (values) {
        if (!values || values.length === 0) {
            return { count: 0, min: 0, max: 0, mean: 0, median: 0, p85: 0, p95: 0 };
        }
        return {
            count: values.length,
            min: Math.min.apply(null, values),
            max: Math.max.apply(null, values),
            mean: mean(values),
            median: percentile.compute(values, 0.5),
            p85: percentile.compute(values, 0.85),
            p95: percentile.compute(values, 0.95)
        };
    }
};
