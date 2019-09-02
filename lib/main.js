var fs = require('fs');
var path = require('path');
var config_loader = require('./config');
var http = require('./http');
var extract = require('./extract');
var util = require('./util');
var logger = require('./logger');
var issue_line = require('./issue_line');
var durations = require('./durations');
var chart_builder = require('./chart_builder');

var OVERRIDABLE = ['output_csv_path', 'output_format', 'output_target', 'project_key', 'from', 'to', 'charts_dir'];

function apply_overrides(config, options) {
    OVERRIDABLE.forEach(function (key) {
        if (options[key]) {
            config[key] = options[key];
        }
    });
    return config;
}

function build_lines(issues, working_times, config) {
    return issues.map(function (issue) {
        var line = issue_line.from(issue, config);
        durations.populate(
            line,
            working_times,
            line.key,
            config.csv_header_columns,
            config.first_column_to_count
        );
        return line;
    });
}

function ensure_dir(dir_path) {
    if (!fs.existsSync(dir_path)) {
        fs.mkdirSync(dir_path, { recursive: true });
    }
}

function write_charts(dir_path, issues, working_times, active_issues, config) {
    ensure_dir(dir_path);
    var lines = build_lines(issues, working_times, config);
    var written = chart_builder.build(lines, config, { active_issues: active_issues }).map(function (chart) {
        var target = path.join(dir_path, chart.name);
        fs.writeFileSync(target, chart.svg);
        return target;
    });
    logger.info('Wrote ' + written.length + ' charts to ' + dir_path);
}

function http_options(config) {
    var base = {
        timeout: config.request_timeout_ms,
        tls_reject_unauthorized: config.tls_reject_unauthorized
    };
    if (config.api_token) {
        base.user = config.email || config.user;
        base.password = config.api_token;
    }
    return base;
}

function suppress_query_auth_if_token(config) {
    if (config.api_token) {
        config.user = '';
        config.password = '';
    }
}

function emit(config, output) {
    if (!output) {
        logger.error('No issues returned. Please check your project, component and work group settings.');
        return;
    }
    if (config.output_target === 'stdout') {
        process.stdout.write(output);
        return;
    }
    return util.save_to_file(config.output_csv_path, output);
}

module.exports = {
    run: function (options) {
        options = options || {};
        if (options.log_level) {
            logger.set_level(options.log_level);
        }
        var config = apply_overrides(config_loader.load(options.config_path), options);
        http.configure(http_options(config));
        suppress_query_auth_if_token(config);
        return extract.run(config).then(function (result) {
            if (config.charts_dir && result.issues) {
                write_charts(config.charts_dir, result.issues, result.working_times, result.active_issues, config);
            }
            return emit(config, result.output);
        });
    }
};
