var GOJIRA = GOJIRA || {};

GOJIRA.config = require('./lib/config').load();
GOJIRA.util = require('./lib/util');
GOJIRA.csv = require('./lib/csv');
GOJIRA.url = require('./lib/url');
GOJIRA.durations = require('./lib/durations');
GOJIRA.issue_line = require('./lib/issue_line');

var request = require("request");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var durations = [];

var issues_url = GOJIRA.url.issues(GOJIRA.config.jira_base_url,
    GOJIRA.config.project_key, GOJIRA.config.component,
    GOJIRA.config.work_group, GOJIRA.config.max_results, GOJIRA.config.user,
    GOJIRA.config.password);

var control_chart_url = GOJIRA.url.control_chart(GOJIRA.config.jira_base_url,
    GOJIRA.config.control_chart,
    GOJIRA.config.user,
    GOJIRA.config.password, GOJIRA.config.from, GOJIRA.config.to);

request(control_chart_url, function(error, response, body) {
    if (error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        durations = json.issues;
    }
});


request(issues_url, function(error, response, body) {
    if (error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        var issues = json.issues;

        if (!issues) {
            console.error(
                'No issues returned. Please check your project, component and work group settings.\n'
            )
        } else {

            var csv = GOJIRA.csv.header(GOJIRA.config.csv_header_columns);

            for (var x = 0; x < issues.length; x++) {
                var line = GOJIRA.issue_line.from(issues[x], GOJIRA.config.points_per_day);
                GOJIRA.durations.populate(line, durations, line.key,
                    GOJIRA.config.csv_header_columns,
                    GOJIRA.config.first_column_to_count);

                csv += GOJIRA.csv.from(line);
            }

            GOJIRA.util.save_to_file(GOJIRA.config.output_csv_path,
                csv);
        }
    }
});
