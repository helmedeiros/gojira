var DAY_MS = 24 * 60 * 60 * 1000;

function back_derive(line) {
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
}

function real_entries(line, columns) {
    return columns.map(function (column) {
        var match = line.transitions.find(function (event) {
            return event.to_status === column;
        });
        return match ? new Date(match.at).getTime() : null;
    });
}

module.exports = {
    for_line: function (line, columns) {
        if (line && Array.isArray(line.transitions) && line.transitions.length > 0 && Array.isArray(columns)) {
            var real = real_entries(line, columns);
            if (real.every(function (entry) { return entry !== null && !isNaN(entry); })) {
                return real;
            }
        }
        return back_derive(line);
    },
    for_lines: function (lines, columns) {
        var self = this;
        return (lines || [])
            .map(function (line) { return self.for_line(line, columns); })
            .filter(function (entered) { return entered !== null; });
    }
};
