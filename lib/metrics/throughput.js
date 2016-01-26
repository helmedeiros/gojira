module.exports = {
    compute: function (issues) {
        if (!issues) {
            return 0;
        }
        return issues.length;
    }
};
