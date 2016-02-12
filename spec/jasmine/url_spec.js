var url = require("../../lib/url");

describe("url", function() {
    var base_url = 'https://jira.example.com';

    it(
        "should return a issues url using project, component, work group, max results, and user",
        function() {
            var project = 'DEMO';
            var component = 'Example Component';
            var work_group = 'Application';
            var max_results = '100';
            var user = 'a_user';
            var password = 'a_password';

            var generated_url = url.issues(base_url, project, component,
                work_group,
                max_results, user, password);

            var expected_url =
                'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+component="Example Component"+and+"Work Group"="Application"+and+type=Story&maxResults=100&os_username=a_user&os_password=a_password';
            expect(generated_url).toBe(expected_url);
        });

    it(
        "should return a issues url using only project, default to 300 of max results, and user",
        function() {
            var project = 'DEMO';
            var component = '';
            var user = 'a_user';
            var password = 'a_password';

            var generated_url = url.issues(base_url, project, component, null,
                null, user,
                password);

            var expected_url =
                'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+type=Story&maxResults=300&os_username=a_user&os_password=a_password';
            expect(generated_url).toBe(expected_url);
        });

    it(
        "should build the json control chart url based on http control chart url, with user and dates",
        function() {
            var control_chart =
                'https://jira.example.com/secure/RapidBoard.jspa?rapidView=1853&view=reporting&chart=controlChart&swimlane=12000&swimlane=10450&swimlane=11466&swimlane=11263&swimlane=11138&swimlane=10926&swimlane=7060&swimlane=7764&swimlane=7062&swimlane=7061&swimlane=7058&column=4325&column=4328&column=4334&days=7';
            var user = 'a_user';
            var password = 'a_password';
            var from = '2015-01-01';
            var to = '2015-12-31';

            var generated_url = url.control_chart(base_url, control_chart,
                user, password,
                from, to);

            var expected_url =
                'https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart?rapidViewId=1853&swimlaneId=12000&swimlaneId=10450&swimlaneId=11466&swimlaneId=11263&swimlaneId=11138&swimlaneId=10926&swimlaneId=7060&swimlaneId=7764&swimlaneId=7062&swimlaneId=7061&swimlaneId=7058&from=2015-01-01&to=2015-12-31&os_username=a_user&os_password=a_password';
            expect(generated_url).toBe(expected_url)
        });
});
