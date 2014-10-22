var request = require("request");
var fs = require("fs");
var _ = require("underscore");

var day = 60 * 60 * 24 * 1000;
var COMMA = ',';

var save_to_file = function(file_name, content) {
    fs.writeFile(file_name, content, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log(content);
            console.log("The file was saved! " + file_name);
        }
    });
}

var populate_times = function(line, issues, issue_key) {
    var issue = _.find(issues, function(i) {
        return i.key == issue_key;
    });
    if (issue) {
        var wt = issue.workingTime;
        line.backlog = parseInt((wt[0] / day) * 10) / 10;
        line.in_progress = parseInt((wt[1] / day) * 10) / 10;
        line.validation = parseInt((wt[2] / day) * 10) / 10;
        line.sign_off = parseInt((wt[3] / day) * 10) / 10;
        line.done = parseInt((wt[4] / day) * 10) / 10;
        line.lead_time = line.in_progress + line.validation + line.sign_off;
    }
}

var csv_line = function(line) {
    var csv = line.type + COMMA;
    csv += line.key + COMMA;
    csv += line.summary + COMMA;
    csv += line.status + COMMA;
    csv += line.points + COMMA;
    csv += line.projected_lead_time + COMMA;
    csv += line.lead_time + COMMA;
    csv += line.backlog + COMMA;
    csv += line.in_progress + COMMA;
    csv += line.validation + COMMA;
    csv += line.sign_off + COMMA;
    csv += line.done + COMMA;
    csv += (line.lead_time - line.projected_lead_time) + COMMA;
    csv += ((line.lead_time) / line.projected_lead_time) + COMMA;
    csv += "\n";
    return csv;
}

var issues_url = function() {
    var AND = '+and+';
    var url = 'https://jira.example.com/rest/api/2/search?';
    url += 'jql=project=DEMO';
    url += AND;
    url += 'status=Done'
    url += AND;
    url += 'component="Example Component"';
    url += AND;
    url += '"Work Group"=Application';
    url += AND;
    url += 'type=Story';
    url += '&maxResults=300';
    url += '&os_username=tv_pas&os_password=tvuser';
    return url;
}
var durations = [];


swimlane=11466
swimlane=10450
swimlane=10926
swimlane=11263
swimlane=11138

swimlaneId=11466
swimlaneId=10450
swimlaneId=10926
swimlaneId=11263
swimlaneId=1113

var url = "https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=11466&swimlaneId=10450&swimlaneId=10926&swimlaneId=11263&swimlaneId=11138&from=2014-07-17&to=2015-09-10&os_username=tv_pas&os_password=tvuser";
request(url, function(error, response, body) {
    if(error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        durations = json.issues;
    }
}).pipe(
    request(issues_url(), function(error, response, body) {
        if(error) {
            console.log(error);
        } else {
            var json = JSON.parse(body);
            var issues = json.issues;

            var csv = "Type,Key,Summary,Status,Story Points,Projected Lead Time,Actual Lead Time,Backlog,In Progress,Validation,Sign Off,Done,Over/Under,Over/Under %\n";

            for (var x=0; x < issues.length; x++) {
                var issue = issues[x];
                var line = function() {};
                line.type = issue.fields.issuetype.name;
                line.key = issue.key;
                line.summary = "\"" + issue.fields.summary + "\"";
                line.status = issue.fields.status.name;
                line.points = issue.fields.customfield_10003;
                line.projected_lead_time = issue.fields.customfield_10003 * 1.25;
                populate_times(line, durations, issue.key);

                csv += csv_line(line);
            }

            save_to_file("/tmp/pete.csv", csv);
        }
    })
);
