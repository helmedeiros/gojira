module.exports = {
    compute: function (lines) {
        if (!lines) {
            return 0;
        }
        return lines.reduce(function (sum, line) {
            return sum + (line.points || 0);
        }, 0);
    }
};
