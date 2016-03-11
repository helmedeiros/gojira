const csv = require('./csv');
const issue_line = require('./issue_line');
const durations = require('./durations');
const throughput = require('./metrics/throughput');
const velocity = require('./metrics/velocity');
const wip = require('./metrics/wip');
const aggregate = require('./metrics/aggregate');

module.exports = {
    build: function (issues, working_times, config) {
        let output = csv.header(config.csv_header_columns);
        for (let i = 0; i < issues.length; i++) {
            const line = issue_line.from(issues[i], config);
            durations.populate(
                line,
                working_times,
                line.key,
                config.csv_header_columns,
                config.first_column_to_count
            );
            output += csv.from(line);
        }
        return output;
    },
    summary: function (lines) {
        const lead_times = (lines || [])
            .filter(function (line) { return typeof line.lead_time === 'number'; })
            .map(function (line) { return line.lead_time; });
        return {
            throughput: throughput.compute(lines),
            velocity: velocity.compute(lines),
            wip: wip.compute(lines),
            cycle_time_stats: aggregate.summarize(lead_times)
        };
    }
};
