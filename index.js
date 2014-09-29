var request = require("request");
var json2csv = require("json2csv");
var fs = require("fs");

var url = "https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=10450&swimlaneId=10926&swimlaneId=11138&from=2014-07-17&to=2019-09-10&os_username=tv_pas&os_password=tvuser";

request(url, function(error, response, body) {
    if(error) {
        console.log(error);
    } else {
        var jsonBody = JSON.parse(body);
        json2csv({data: jsonBody.issues, fields: ['key','summary']}, function(err, csv) {
            if (err)
                console.log(err);

            fs.writeFile("/tmp/test", csv, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("The file was saved! /tmp/test");
                }
            });
        });
    }
});
