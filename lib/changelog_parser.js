function status_items(history) {
    return (history.items || []).filter(function (item) {
        return item.field === 'status';
    });
}

function transition_events(histories) {
    var events = [];
    histories.forEach(function (history) {
        status_items(history).forEach(function (item) {
            events.push({
                at: history.created,
                to_status: item.toString,
                from_status: item.fromString
            });
        });
    });
    return events.sort(function (a, b) {
        return Date.parse(a.at) - Date.parse(b.at);
    });
}

module.exports = {
    extract: function (issue) {
        if (!issue) {
            return [];
        }
        var histories = (issue.changelog && issue.changelog.histories) || [];
        var events = transition_events(histories);
        var created = issue.fields && issue.fields.created;
        var first = events[0];
        if (created && first && first.from_status) {
            events.unshift({ at: created, to_status: first.from_status });
        }
        return events.map(function (event) {
            return { at: event.at, to_status: event.to_status };
        });
    }
};
