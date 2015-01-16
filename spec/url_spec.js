var url = require("../lib/url");

describe("url", function () {
    it("should return a issues url using project, component, work group, and max results", function () {
        var project = 'DEMO';
        var component = 'Example Component';
        var work_group = 'Application';
        var max_results = '100';

        var generated_url = url.issues(project, component, work_group, max_results);

        var expected_url = 'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+component="Example Component"+and+"Work Group"="Application"+and+type=Story&maxResults=100&os_username=tv_pas&os_password=tvuser';
        expect(generated_url).toBe(expected_url);
    });

    it("should return a issues url using only project and default to 300 of max results", function () {
        var project = 'DEMO';
        var component = '';

        var generated_url = url.issues(project, component, null, null);

        var expected_url = 'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+type=Story&maxResults=300&os_username=tv_pas&os_password=tvuser';
        expect(generated_url).toBe(expected_url);
    });

    it("should build the json control chart url based on http control chart url", function () {
        var control_chart = 'https://jira.example.com/secure/RapidBoard.jspa?rapidView=1853&view=reporting&chart=controlChart&swimlane=12000&swimlane=10450&swimlane=11466&swimlane=11263&swimlane=11138&swimlane=10926&swimlane=7060&swimlane=7764&swimlane=7062&swimlane=7061&swimlane=7058&column=4325&column=4328&column=4334&days=7';

        var generated_url = url.control_chart(control_chart);

        var expected_url = 'https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=12000&swimlaneId=10450&swimlaneId=11466&swimlaneId=11263&swimlaneId=11138&swimlaneId=10926&swimlaneId=7060&swimlaneId=7764&swimlaneId=7062&swimlaneId=7061&swimlaneId=7058&from=2014-07-17&to=2015-09-10&os_username=tv_pas&os_password=tvuser';
        expect(generated_url).toBe(expected_url)
    });
});
