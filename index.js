var GOJIRA = GOJIRA || {};

GOJIRA.config = require('./project_config');
GOJIRA.util = require('./lib/util');
GOJIRA.csv = require('./lib/csv');
GOJIRA.url = require('./lib/url');

var request = require("request");
var _ = require("underscore");

var day = 60 * 60 * 24 * 1000;

var populate_times = function(line, issues, issue_key, csv_columns) {
    var issue = _.find(issues, function(i) {
        return i.key == issue_key;
    });
    if (issue) {
        var wt = issue.workingTime;

        var columns_size = csv_columns.split(',').length;
        console.log('COLUMNS SIZE: ' + columns_size + '\n\n');
        var time_line = '';
        var lead_time = 0;
        for (var columns = 0; columns < columns_size; columns++) {
            if (columns < GOJIRA.config.first_column_to_count) {
                time_line += parseInt((wt[columns] / day) * 10) / 10;
            } else if (columns == columns_size - 1) {
                time_line += parseInt((wt[columns] / day) * 10) / 10;
            } else {
                lead_time += parseInt((wt[columns] / day) * 10) / 10;
                time_line += parseInt((wt[columns] / day) * 10) / 10;
            }
            time_line += ',';

        }

        //if (line.key === 'DEMO-905') {
        //    line.in_progress = line.in_progress - 22;
        //}
        line.times = time_line;
        line.lead_time = lead_time;
    }
};

var durations = [];

var issues_url = GOJIRA.url.issues(GOJIRA.config.project_key, GOJIRA.config.component,
    GOJIRA.config.work_group, GOJIRA.config.max_results, GOJIRA.config.user,
    GOJIRA.config.password);

var control_chart_url = GOJIRA.url.control_chart(GOJIRA.config.control_chart,
    GOJIRA.config.user,
    GOJIRA.config.password, GOJIRA.config.from, GOJIRA.config.to);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
request(control_chart_url, function(error, response, body) {
    if (error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        durations = json.issues;
    }
}).pipe(
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
                    var issue = issues[x];
                    var issue_line = function() {};
                    issue_line.type = issue.fields.issuetype.name;
                    issue_line.key = issue.key;
                    issue_line.summary = "\"" + issue.fields.summary +
                        "\"";
                    issue_line.status = issue.fields.status.name;
                    issue_line.points = issue.fields.customfield_10003;
                    issue_line.projected_lead_time = issue.fields.customfield_10003 *
                        GOJIRA.config.points_per_day;
                    populate_times(issue_line, durations, issue.key,
                        GOJIRA.config.csv_header_columns);

                    csv += GOJIRA.csv.from(issue_line);
                }

                GOJIRA.util.save_to_file(GOJIRA.config.output_csv_path,
                    csv);
            }
        }
    })
);
