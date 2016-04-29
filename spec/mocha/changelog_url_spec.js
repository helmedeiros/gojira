var expect = require('chai').expect;
var changelog_url = require('../../lib/changelog_url');

describe('changelog_url.build', function () {
    it('builds the Jira issue endpoint with expand=changelog', function () {
        var url = changelog_url.build('https://jira.example.com', 'DEMO-1', 'a_user', 'a_password');
        expect(url).to.equal(
            'https://jira.example.com/rest/api/2/issue/DEMO-1?expand=changelog&os_username=a_user&os_password=a_password'
        );
    });

    it('omits credentials when user is empty', function () {
        var url = changelog_url.build('https://jira.example.com', 'DEMO-1', '', '');
        expect(url).to.equal('https://jira.example.com/rest/api/2/issue/DEMO-1?expand=changelog');
    });

    it('url-encodes issue keys', function () {
        var url = changelog_url.build('https://jira.example.com', 'PROJ A/1', 'u', 'p');
        expect(url).to.contain('PROJ%20A%2F1');
    });
});
