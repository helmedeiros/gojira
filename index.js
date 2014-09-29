var request = require("request");
var csv = require('json-csv')
var fs = require("fs");

var url = "https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=10450&swimlaneId=10926&swimlaneId=11138&from=2014-07-17&to=2019-09-10&os_username=tv_pas&os_password=tvuser";
var day = 60 * 60 * 24 * 1000;

request(url, function(error, response, body) {
    if(error) {
        console.log(error);
    } else {
        var json = JSON.parse(body);
        var issues = json.issues;

        csv.csvBuffered(issues, {
            fields : [ {
                    name : 'key',
                    label : 'Key'
                },{
                    name : 'summary',
                    label : 'Summary'
                }, {
                    name : 'workingTime.0',
                    label : 'Backlog',
                    filter : function(value) {
                        return value / day;
                    }
                }, {
                    name : 'workingTime.1',
                    label : 'In Progress',
                    filter : function(value) {
                        return value / day;
                    }
                }, {
                    name : 'workingTime.2',
                    label : 'Validation',
                    filter : function(value) {
                        return value / day;
                    }
                }, {
                    name : 'workingTime.3',
                    label : 'Sign Off',
                    filter : function(value) {
                        return value / day;
                    }
                }, {
                    name : 'workingTime.4',
                    label : 'Done',
                    filter : function(value) {
                        return value / day;
                    }
                }, {
                    name : 'workingTime',
                    label : 'Lead Time',
                    filter : function(value) {
                        var lead_time = 0;
                        for (var x=1; x < value.length - 1; x++) {
                            lead_time += value[x];
                        }
                        return lead_time / day;
                    }
                }]
            },
            function(err, output) {
                fs.writeFile("/tmp/test.csv", output, function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("The file was saved! /tmp/test.csv");
                        console.log(output);
                    }
                });
            }
        );
    }
});
