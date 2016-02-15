var expect = require('chai').expect;
var config = require('../../lib/config');

describe('config', function () {
    it('loads a JSON file from disk', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');

        expect(loaded.jira_base_url).to.equal('https://jira.example.com');
        expect(loaded.project_key).to.equal('DEMO');
        expect(loaded.user).to.equal('a_user');
    });

    it('throws when jira_base_url is missing', function () {
        expect(function () {
            config.load('./spec/fixtures/missing_base_url.json');
        }).to.throw(Error, 'Missing required config field: jira_base_url');
    });

    it('throws when project_key is missing', function () {
        expect(function () {
            config.load('./spec/fixtures/missing_project_key.json');
        }).to.throw(Error, 'Missing required config field: project_key');
    });

    it('throws when control_chart is missing', function () {
        expect(function () {
            config.load('./spec/fixtures/missing_control_chart.json');
        }).to.throw(Error, 'Missing required config field: control_chart');
    });

    it('coerces max_results to integer', function () {
        var loaded = config.load('./spec/fixtures/max_results_string.json');
        expect(loaded.max_results).to.equal(150);
    });

    it('defaults max_results to 300 when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.max_results).to.equal(300);
    });

    it('coerces points_per_day to number', function () {
        var loaded = config.load('./spec/fixtures/points_per_day_string.json');
        expect(loaded.points_per_day).to.equal(2.5);
    });

    it('defaults points_per_day to 1.25 when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.points_per_day).to.equal(1.25);
    });

    it('coerces first_column_to_count to integer', function () {
        var loaded = config.load('./spec/fixtures/first_column_string.json');
        expect(loaded.first_column_to_count).to.equal(2);
    });

    it('defaults first_column_to_count to 1 when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.first_column_to_count).to.equal(1);
    });

    it('defaults csv_header_columns when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.csv_header_columns).to.equal('Backlog,In Progress,Done');
    });

    it('defaults request_timeout_ms to 30000 when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.request_timeout_ms).to.equal(30000);
    });

    it('defaults include_metrics to false when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.include_metrics).to.equal(false);
    });

    it('defaults output_format to csv when missing', function () {
        var loaded = config.load('./spec/fixtures/sample_config.json');
        expect(loaded.output_format).to.equal('csv');
    });

    it('throws on an unsupported output_format', function () {
        expect(function () {
            config.load('./spec/fixtures/bad_format.json');
        }).to.throw(Error, 'Unsupported output_format: yaml');
    });
});
