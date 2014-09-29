var request = require("request");
var csv = require('json-csv')
var fs = require("fs");

var url = "https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=10450&swimlaneId=10926&swimlaneId=11138&from=2014-07-17&to=2019-09-10&os_username=tv_pas&os_password=tvuser";

request(url, function(error, response, body) {
    if(error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        var issues = json.issues;

        var output = "Key, Summary, Backlog, In Progress, Validation, Sign Off, Done, Cycle Time, Swimlane, Sign-off Date\n";

        for (var x=0; x < issues.length; x++) {
            output += issues[x].key + ", ";
            output += issues[x].summary + ", ";
            var times = issues[x].workingTime;
            for (var y=0; y < times.length; y++) {
                output += (times[y] / (60 * 60 * 24 * 1000)) + ", ";
            }
            console.log(output);
            output += "\n";
        }
        fs.writeFile("/tmp/test.csv", output, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved! /tmp/test.csv");
            }
        });
    }
});
