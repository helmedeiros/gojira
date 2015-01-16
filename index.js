var GOJIRA = GOJIRA || {};

GOJIRA.config = require('./project_config');
GOJIRA.util = require('./util');
GOJIRA.csv = require('./csv');
GOJIRA.url = require('./lib/url');

var request = require("request");
var _ = require("underscore");

var day = 60 * 60 * 24 * 1000;

var populate_times = function (line, issues, issue_key) {
    var issue = _.find(issues, function (i) {
        return i.key == issue_key;
    });
    if (issue) {
        var wt = issue.workingTime;
        line.backlog = parseInt((wt[0] / day) * 10) / 10;
        line.in_progress = parseInt((wt[1] / day) * 10) / 10;
        if (line.key === 'DEMO-905') {
            line.in_progress = line.in_progress - 22;
        }
        line.validation = parseInt((wt[2] / day) * 10) / 10;
        line.sign_off = parseInt((wt[3] / day) * 10) / 10;
        line.done = parseInt((wt[4] / day) * 10) / 10;
        line.lead_time = line.in_progress + line.validation + line.sign_off;
    }
};

var durations = [];

var issues_url = GOJIRA.url.build_for(GOJIRA.config.project_key, GOJIRA.config.component,
    GOJIRA.config.work_group, GOJIRA.config.max_results);

var url = "https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=11466&swimlaneId=10450&swimlaneId=10926&swimlaneId=11263&swimlaneId=11138&from=2014-07-17&to=2015-09-10&os_username=tv_pas&os_password=tvuser";
request(url, function (error, response, body) {
    if (error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        durations = json.issues;
    }
}).pipe(
    request(issues_url, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            var json = JSON.parse(body);
            var issues = json.issues;

            if (!issues) {
                console.error('No issues returned. Please check your project, component and work group settings.\n')
            } else {

                var csv = GOJIRA.csv.header();

                for (var x = 0; x < issues.length; x++) {
                    var issue = issues[x];
                    var issue_line = function () {
                    };
                    issue_line.type = issue.fields.issuetype.name;
                    issue_line.key = issue.key;
                    issue_line.summary = "\"" + issue.fields.summary + "\"";
                    issue_line.status = issue.fields.status.name;
                    issue_line.points = issue.fields.customfield_10003;
                    issue_line.projected_lead_time = issue.fields.customfield_10003 * 1.25;
                    populate_times(issue_line, durations, issue.key);

                    csv += GOJIRA.csv.from(issue_line);
                }

                GOJIRA.util.save_to_file("/tmp/pete.csv", csv);
            }
        }
    })
);
