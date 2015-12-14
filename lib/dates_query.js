module.exports = {
    dates_url: function (from, to) {
        var parts = [];
        if (from) {
            parts.push('&from=' + from);
        }
        if (to) {
            parts.push('&to=' + to);
        }
        return parts.join('');
    }
};
