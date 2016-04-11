var DAY_MS = 24 * 60 * 60 * 1000;

module.exports = {
    for_line: function (line) {
        if (!line || !line.resolved_at || !Array.isArray(line.times_array) || line.times_array.length === 0) {
            return null;
        }
        var resolved_ms = new Date(line.resolved_at).getTime();
        if (isNaN(resolved_ms)) {
            return null;
        }
        var times = line.times_array;
        var last_index = times.length - 1;
        var entered = new Array(times.length);
        entered[last_index] = resolved_ms;
        for (var i = last_index - 1; i >= 0; i--) {
            entered[i] = entered[i + 1] - times[i] * DAY_MS;
        }
        return entered;
    },
    for_lines: function (lines) {
        var self = this;
        return (lines || [])
            .map(function (line) { return self.for_line(line); })
            .filter(function (entered) { return entered !== null; });
    }
};
