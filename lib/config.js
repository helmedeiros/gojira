var fs = require('fs');
var path = require('path');

var DEFAULT_MAX_RESULTS = 300;
var DEFAULT_POINTS_PER_DAY = 1.25;
var DEFAULT_FIRST_COLUMN_TO_COUNT = 1;
var DEFAULT_CSV_HEADER_COLUMNS = 'Backlog,In Progress,Done';
var DEFAULT_REQUEST_TIMEOUT_MS = 30000;
var DEFAULT_STORY_POINTS_FIELD = 'customfield_10003';
var SUPPORTED_FORMATS = ['csv', 'json', 'markdown', 'html'];
var DEFAULT_OUTPUT_FORMAT = 'csv';
var SUPPORTED_TARGETS = ['file', 'stdout'];
var DEFAULT_OUTPUT_TARGET = 'file';

function require_field(config, field) {
    if (!config[field]) {
        throw new Error('Missing required config field: ' + field);
    }
}

module.exports = {
    load: function (config_path) {
        var resolved = path.resolve(config_path || './project_config.json');
        var raw = fs.readFileSync(resolved, 'utf8');
        var config = JSON.parse(raw);

        require_field(config, 'jira_base_url');
        require_field(config, 'project_key');
        require_field(config, 'control_chart');

        config.max_results = parseInt(config.max_results, 10) || DEFAULT_MAX_RESULTS;
        config.points_per_day = parseFloat(config.points_per_day) || DEFAULT_POINTS_PER_DAY;
        config.first_column_to_count = parseInt(config.first_column_to_count, 10);
        if (isNaN(config.first_column_to_count)) {
            config.first_column_to_count = DEFAULT_FIRST_COLUMN_TO_COUNT;
        }
        config.csv_header_columns = config.csv_header_columns || DEFAULT_CSV_HEADER_COLUMNS;
        config.request_timeout_ms = parseInt(config.request_timeout_ms, 10) || DEFAULT_REQUEST_TIMEOUT_MS;
        config.story_points_field = config.story_points_field || DEFAULT_STORY_POINTS_FIELD;
        config.include_metrics = Boolean(config.include_metrics);
        config.output_format = config.output_format || DEFAULT_OUTPUT_FORMAT;
        if (SUPPORTED_FORMATS.indexOf(config.output_format) === -1) {
            throw new Error('Unsupported output_format: ' + config.output_format);
        }
        config.output_target = config.output_target || DEFAULT_OUTPUT_TARGET;
        if (SUPPORTED_TARGETS.indexOf(config.output_target) === -1) {
            throw new Error('Unsupported output_target: ' + config.output_target);
        }

        return config;
    }
};
