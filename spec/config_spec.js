var config = require('../lib/config');

describe('config', function () {
    it('loads a JSON file from disk', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');

        expect(loaded.jira_base_url).toBe('https://jira.example.com');
        expect(loaded.project_key).toBe('DEMO');
        expect(loaded.user).toBe('a_user');
    });

    it('throws when jira_base_url is missing', function () {
        expect(function () {
            config.load('./spec/fixtures/missing_base_url.json');
        }).toThrow(new Error('Missing required config field: jira_base_url'));
    });

    it('throws when project_key is missing', function () {
        expect(function () {
            config.load('./spec/fixtures/missing_project_key.json');
        }).toThrow(new Error('Missing required config field: project_key'));
    });

    it('throws when control_chart is missing', function () {
        expect(function () {
            config.load('./spec/fixtures/missing_control_chart.json');
        }).toThrow(new Error('Missing required config field: control_chart'));
    });
});
