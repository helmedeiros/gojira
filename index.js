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

var lead_times = function(issues, issue_key) {
    var issue = _.find(issues, function(i) {
        return i.key == issue_key;
    });
    console.log("Issue: " + issue);
    if (issue) {
        var wt = issue.workingTime;
        var backlog = parseInt((wt[0] / day) * 10) / 10;
        var in_progress = parseInt((wt[1] / day) * 10) / 10;
        var validation = parseInt((wt[2] / day) * 10) / 10;
        var sign_off = parseInt((wt[3] / day) * 10) / 10;
        var done = parseInt((wt[4] / day) * 10) / 10;
        var lead_time = in_progress + validation + sign_off;
        return  lead_time + "," + backlog + "," + in_progress + "," + validation + "," + sign_off + "," + done + ",";
    } else {
        return  0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + ",";
    }
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

var url = "https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=10450&swimlaneId=10926&swimlaneId=11138&from=2010-07-17&to=2019-10-10&os_username=tv_pas&os_password=tvuser";
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
                csv += issue.fields.issuetype.name + COMMA;
                csv += issue.key + COMMA;
                csv += "\"" + issue.fields.summary + "\",";
                csv += issue.fields.status.name + COMMA;
                csv += issue.fields.customfield_10003 + COMMA;
                csv += issue.fields.customfield_10003 * 1.25 + COMMA;
                csv += lead_times(durations, issue.key);
                csv += "Over Under???,";
                csv += "Over Under %???";
                csv += "\n";
            }

            save_to_file("/tmp/pete.csv", csv);
        }
    })
);
