const TERMINAL_STATUSES = ['Backlog', 'Done'];

module.exports = {
    compute: function (lines) {
        if (!lines) {
            return 0;
        }
        return lines.filter(function (line) {
            return TERMINAL_STATUSES.indexOf(line.status) === -1;
        }).length;
    }
};
