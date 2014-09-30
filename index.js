var request = require("request");
var fs = require("fs");

var url = "https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=10450&swimlaneId=10926&swimlaneId=11138&from=2014-07-17&to=2019-09-10&os_username=tv_pas&os_password=tvuser";
var day = 60 * 60 * 24 * 1000;

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

var lead_times = function(issue) {
    var wt = issue.workingTime;
    var backlog = parseInt((wt[0] / day) * 10) / 10;
    var in_progress = parseInt((wt[1] / day) * 10) / 10;
    var validation = parseInt((wt[2] / day) * 10) / 10;
    var sign_off = parseInt((wt[3] / day) * 10) / 10;
    var done = parseInt((wt[4] / day) * 10) / 10;
    var lead_time = in_progress + validation + sign_off;
    return  lead_time + "," + backlog + "," + in_progress + "," + validation + "," + sign_off + "," + done + ",";
}

request(url, function(error, response, body) {
    if(error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        var issues = json.issues;

        var csv = "Type,Key,Summary,Status,Story Points,Projected Lead Time,Actual Lead Time,Backlog,In Progress,Validation,Sign Off,Done,Over/Under,Over/Under %\n";

        for (var x=0; x < issues.length; x++) {
            var issue = issues[x];
            csv += "Type???,";
            csv += issue.key + ",";
            csv += "\"" + issue.summary + "\",";
            csv += "Status???,";
            csv += "Story Points???,";
            csv += "Projected Lead Time???,";
            csv += lead_times(issue);
            csv += "Over Under???,";
            csv += "Over Under %???";
            csv += "\n";
        }

        save_to_file("/tmp/pete.csv", csv);
    }
});
