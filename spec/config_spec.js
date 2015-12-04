var config = require('../lib/config');

describe('config', function () {
    it('loads a JSON file from disk', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');

        expect(loaded.jira_base_url).toBe('https://jira.example.com');
        expect(loaded.project_key).toBe('DEMO');
        expect(loaded.user).toBe('a_user');
    });
});
