var http = require('./http');

module.exports = {
    load: function (url_for_page) {
        function go(start_at, acc) {
            return http.get(url_for_page(start_at)).then(function (data) {
                var page = (data && data.issues) || [];
                var combined = acc.concat(page);
                var total = data && data.total;
                if (page.length === 0 || typeof total !== 'number' || combined.length >= total) {
                    return combined;
                }
                return go(combined.length, combined);
            });
        }
        return go(0, []);
    }
};
