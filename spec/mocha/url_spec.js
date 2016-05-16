var expect = require('chai').expect;
var url = require('../../lib/url');

describe('url', function () {
    var base_url = 'https://jira.example.com';

    it('builds an issues url with project, component, work group, max results, and user', function () {
        var generated = url.issues(base_url, 'DEMO', 'Example Component', 'Application', '100', 'a_user', 'a_password');

        expect(generated).to.equal(
            'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+component="Example Component"+and+"Work Group"="Application"+and+type=Story&maxResults=100&startAt=0&os_username=a_user&os_password=a_password'
        );
    });

    it('builds an issues url with only project, defaulting max_results to 300', function () {
        var generated = url.issues(base_url, 'DEMO', '', null, null, 'a_user', 'a_password');

        expect(generated).to.equal(
            'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+type=Story&maxResults=300&startAt=0&os_username=a_user&os_password=a_password'
        );
    });

    it('lets the caller override the status filter', function () {
        var generated = url.issues(base_url, 'DEMO', '', null, '50', 'a_user', 'a_password', 'status!=Done');

        expect(generated).to.contain('jql=project=DEMO+and+status!=Done');
        expect(generated).to.contain('maxResults=50');
    });

    it('emits startAt=0 by default and the supplied value when given', function () {
        var first = url.issues(base_url, 'DEMO', '', null, '50', 'u', 'p');
        var second = url.issues(base_url, 'DEMO', '', null, '50', 'u', 'p', null, 100);
        expect(first).to.contain('startAt=0');
        expect(second).to.contain('startAt=100');
    });

    it('builds the json control chart url from the source url, user and dates', function () {
        var control_chart =
            'https://jira.example.com/secure/RapidBoard.jspa?rapidView=1853&view=reporting&chart=controlChart&swimlane=12000&swimlane=10450&swimlane=11466&swimlane=11263&swimlane=11138&swimlane=10926&swimlane=7060&swimlane=7764&swimlane=7062&swimlane=7061&swimlane=7058&column=4325&column=4328&column=4334&days=7';

        var generated = url.control_chart(base_url, control_chart, 'a_user', 'a_password', '2015-01-01', '2015-12-31');

        expect(generated).to.equal(
            'https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=12000&swimlaneId=10450&swimlaneId=11466&swimlaneId=11263&swimlaneId=11138&swimlaneId=10926&swimlaneId=7060&swimlaneId=7764&swimlaneId=7062&swimlaneId=7061&swimlaneId=7058&from=2015-01-01&to=2015-12-31&os_username=a_user&os_password=a_password'
        );
    });
});
