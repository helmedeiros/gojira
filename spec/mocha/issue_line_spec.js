var expect = require('chai').expect;
var issue_line = require('../../lib/issue_line');

describe('issue_line', function () {
    var jira_issue;
    var config;

    beforeEach(function () {
        jira_issue = {
            key: 'DEMO-1',
            fields: {
                issuetype: { name: 'Story' },
                status: { name: 'Done' },
                summary: 'Sample Story',
                customfield_10003: 4
            }
        };
        config = { points_per_day: 1.25, story_points_field: 'customfield_10003' };
    });

    it('maps type, key, status and quoted summary', function () {
        var line = issue_line.from(jira_issue, config);
        expect(line.type).to.equal('Story');
        expect(line.key).to.equal('DEMO-1');
        expect(line.status).to.equal('Done');
        expect(line.summary).to.equal('"Sample Story"');
    });

    it('exposes story points from the configured field', function () {
        var line = issue_line.from(jira_issue, config);
        expect(line.points).to.equal(4);
    });

    it('reads points from a custom story_points_field when configured', function () {
        jira_issue.fields.customfield_42 = 7;
        config.story_points_field = 'customfield_42';
        var line = issue_line.from(jira_issue, config);
        expect(line.points).to.equal(7);
    });

    it('projects lead time from points and points_per_day', function () {
        var line = issue_line.from(jira_issue, config);
        expect(line.projected_lead_time).to.equal(5);
    });

    it('captures created and resolutiondate from Jira fields', function () {
        jira_issue.fields.created = '2016-01-10T09:00:00.000+0000';
        jira_issue.fields.resolutiondate = '2016-01-20T17:00:00.000+0000';
        var line = issue_line.from(jira_issue, config);
        expect(line.created_at).to.equal('2016-01-10T09:00:00.000+0000');
        expect(line.resolved_at).to.equal('2016-01-20T17:00:00.000+0000');
    });

    it('falls back to null when the date fields are missing', function () {
        var line = issue_line.from(jira_issue, config);
        expect(line.created_at).to.equal(null);
        expect(line.resolved_at).to.equal(null);
    });
});
