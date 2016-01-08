var GOJIRA = GOJIRA || {};

GOJIRA.config = require('./lib/config').load();
GOJIRA.util = require('./lib/util');
GOJIRA.csv = require('./lib/csv');
GOJIRA.url = require('./lib/url');
GOJIRA.durations = require('./lib/durations');
GOJIRA.issue_line = require('./lib/issue_line');
GOJIRA.http = require('./lib/http');
GOJIRA.control_chart_loader = require('./lib/control_chart_loader');
GOJIRA.issues_loader = require('./lib/issues_loader');

var durations = [];

GOJIRA.control_chart_loader.load(GOJIRA.config, function (error, list) {
    if (error) {
        console.log(error);
    } else {
        durations = list;
    }
});


GOJIRA.issues_loader.load(GOJIRA.config, function (error, issues) {
    if (error) {
        console.log(error);
    } else if (!issues) {
        console.error('No issues returned. Please check your project, component and work group settings.\n');
    } else {
        var csv = GOJIRA.csv.header(GOJIRA.config.csv_header_columns);

        for (var x = 0; x < issues.length; x++) {
            var line = GOJIRA.issue_line.from(issues[x], GOJIRA.config.points_per_day);
            GOJIRA.durations.populate(line, durations, line.key,
                GOJIRA.config.csv_header_columns,
                GOJIRA.config.first_column_to_count);

            csv += GOJIRA.csv.from(line);
        }

        GOJIRA.util.save_to_file(GOJIRA.config.output_csv_path, csv);
    }
});
