var issue_line = require('../../lib/issue_line');

describe('issue_line', function () {
    var jira_issue;

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
    });

    it('maps type, key, status and quoted summary', function () {
        var line = issue_line.from(jira_issue, 1.25);
        expect(line.type).toBe('Story');
        expect(line.key).toBe('DEMO-1');
        expect(line.status).toBe('Done');
        expect(line.summary).toBe('"Sample Story"');
    });

    it('exposes story points', function () {
        var line = issue_line.from(jira_issue, 1.25);
        expect(line.points).toBe(4);
    });

    it('projects lead time from points and points_per_day', function () {
        var line = issue_line.from(jira_issue, 1.25);
        expect(line.projected_lead_time).toBe(5);
    });
});
