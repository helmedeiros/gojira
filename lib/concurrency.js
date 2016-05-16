module.exports = {
    map_with_limit: function (items, limit, mapper) {
        var list = items || [];
        if (list.length === 0) {
            return Promise.resolve([]);
        }
        var results = new Array(list.length);
        var next_index = 0;
        function worker() {
            if (next_index >= list.length) {
                return Promise.resolve();
            }
            var current = next_index++;
            return Promise.resolve(mapper(list[current], current)).then(function (value) {
                results[current] = value;
                return worker();
            });
        }
        var workers = [];
        var active = Math.min(limit, list.length);
        for (var i = 0; i < active; i++) {
            workers.push(worker());
        }
        return Promise.all(workers).then(function () { return results; });
    }
};
