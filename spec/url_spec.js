var url = require("../lib/url");

describe("url", function () {
    it("should return a issues url using project, component, work group, and max results", function () {

        var project = 'DEMO';
        var component = 'Example Component';
        var work_group = 'Application';
        var max_results = '100';
        var generated_url = url.build_for(project, component, work_group, max_results);
        var expected_url = 'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+component="Example Component"+and+"Work Group"="Application"+and+type=Story&maxResults=100&os_username=tv_pas&os_password=tvuser';
        expect(generated_url).toBe(expected_url);
    });
    it("should return a issues url using only project and default to 300 of max results", function () {

        var project = 'DEMO';
        var component = '';
        var generated_url = url.build_for(project, component, null, null);
        var expected_url = 'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+type=Story&maxResults=300&os_username=tv_pas&os_password=tvuser';
        expect(generated_url).toBe(expected_url);
    });
});