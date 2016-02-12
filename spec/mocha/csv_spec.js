var expect = require('chai').expect;
var csv = require('../../lib/csv');

describe('csv', function () {
    it('builds a custom header', function () {
        var header = csv.header('Backlog,In Progress,Validation,Ready For Sign Off,Sign Off,Done');

        var expected = 'Type,Key,Summary,Status,Story Points,Projected Lead Time,Actual Lead Time,Backlog,In Progress,Validation,Ready For Sign Off,Sign Off,Done,Over/Under,Over/Under %\n';
        expect(header).to.equal(expected);
    });

    it('builds a csv row from a line', function () {
        var issue = {
            type: 'Story',
            key: 'DEMO-100',
            summary: '"Business Story"',
            status: 'Backlog',
            points: 4,
            projected_lead_time: 4 * 1.25,
            times: '7.9,5,0.9,2.1,75.8,',
            lead_time: 8
        };

        expect(csv.from(issue))
            .to.equal('Story,DEMO-100,"Business Story",Backlog,4,5,8,7.9,5,0.9,2.1,75.8,3,1.6,\n');
    });

    it('emits zero ratio when projected_lead_time is zero', function () {
        var issue = {
            type: 'Story',
            key: 'DEMO-200',
            summary: '"Zero Projection"',
            status: 'Done',
            points: 0,
            projected_lead_time: 0,
            times: '1,1,',
            lead_time: 2
        };

        expect(csv.from(issue))
            .to.equal('Story,DEMO-200,"Zero Projection",Done,0,0,2,1,1,2,0,\n');
    });
});
