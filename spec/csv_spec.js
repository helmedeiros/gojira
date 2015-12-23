var csv = require("../lib/csv");

describe("csv", function () {
    it("should create a custom header", function () {
        var header = csv.header("Backlog,In Progress,Validation,Ready For Sign Off,Sign Off,Done");

        var expectedHeader = 'Type,Key,Summary,Status,Story Points,Projected Lead Time,Actual Lead Time,Backlog,In Progress,Validation,Ready For Sign Off,Sign Off,Done,Over/Under,Over/Under %\n';
        expect(header).toBe(expectedHeader);
    });
    it("should create a csv from line", function () {
        var issue = function() {
        };
        issue.type = 'Story';
        issue.key = 'DEMO-100';
        issue.summary = "\"Business Story\"";
        issue.status = 'Backlog';
        issue.points = 4;
        issue.projected_lead_time = 4 * 1.25;
        issue.times = '7.9,5,0.9,2.1,75.8,';
        issue.lead_time = 8;

        var csv_line = csv.from(issue);
        expect(csv_line).toBe('Story,DEMO-100,\"Business Story\",Backlog,4,5,8,7.9,5,0.9,2.1,75.8,3,1.6,\n');
    });

    it("emits zero ratio when projected_lead_time is zero", function () {
        var issue = function () {};
        issue.type = 'Story';
        issue.key = 'DEMO-200';
        issue.summary = '"Zero Projection"';
        issue.status = 'Done';
        issue.points = 0;
        issue.projected_lead_time = 0;
        issue.times = '1,1,';
        issue.lead_time = 2;

        var csv_line = csv.from(issue);
        expect(csv_line).toBe('Story,DEMO-200,"Zero Projection",Done,0,0,2,1,1,2,0,\n');
    });
});