const DAY_MS = 60 * 60 * 24 * 1000;

function tenths(ms) {
    return parseInt((ms / DAY_MS) * 10) / 10;
}

module.exports = {
    populate: function (line, issues, issue_key, csv_columns, first_column_to_count) {
        const issue = issues.find(function (i) {
            return i.key === issue_key;
        });
        if (!issue) {
            return;
        }
        const wt = issue.workingTime;
        const columns_size = csv_columns.split(',').length;
        let time_line = '';
        let lead_time = 0;
        const times_array = [];
        for (let columns = 0; columns < columns_size; columns++) {
            const value = tenths(wt[columns]);
            times_array.push(value);
            time_line += value;
            if (columns >= first_column_to_count && columns !== columns_size - 1) {
                lead_time += value;
            }
            time_line += ',';
        }
        line.times = time_line;
        line.times_array = times_array;
        line.lead_time = lead_time;
    }
};
