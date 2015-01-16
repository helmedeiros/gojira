var url = require("../lib/url");

describe("url", function () {
    it("should return a issues url using project, component, and work group", function () {

        var project = 'DEMO';
        var component = 'Example Component';
        var work_group = 'Application';
        var generated_url = url.build_for(project, component, work_group);
        var expected_url = 'https://jira.example.com/rest/api/2/search?jql=project=DEMO+and+status=Done+and+component="Example Component"+and+"Work Group"="Application"+and+type=Story&maxResults=300&os_username=tv_pas&os_password=tvuser';
        expect(generated_url).toBe(expected_url);
    });
});