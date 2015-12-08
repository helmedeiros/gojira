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

    it('coerces max_results to integer', function () {
        var loaded = config.load('./spec/fixtures/max_results_string.json');
        expect(loaded.max_results).toBe(150);
    });

    it('defaults max_results to 300 when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.max_results).toBe(300);
    });

    it('coerces points_per_day to number', function () {
        var loaded = config.load('./spec/fixtures/points_per_day_string.json');
        expect(loaded.points_per_day).toBe(2.5);
    });

    it('defaults points_per_day to 1.25 when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.points_per_day).toBe(1.25);
    });
});
