var GOJIRA = GOJIRA || {};

GOJIRA.config = require('./lib/config').load();
GOJIRA.util = require('./lib/util');
require('./lib/http').configure({ timeout: GOJIRA.config.request_timeout_ms });
GOJIRA.control_chart_loader = require('./lib/control_chart_loader');
GOJIRA.issues_loader = require('./lib/issues_loader');
GOJIRA.csv_writer = require('./lib/csv_writer');

var durations = [];

GOJIRA.control_chart_loader.load(GOJIRA.config)
    .then(function (list) {
        durations = list;
    })
    .catch(function (error) {
        console.log(error);
    });

GOJIRA.issues_loader.load(GOJIRA.config, function (error, issues) {
    if (error) {
        console.log(error);
    } else if (!issues) {
        console.error('No issues returned. Please check your project, component and work group settings.\n');
    } else {
        var csv = GOJIRA.csv_writer.build(issues, durations, GOJIRA.config);
        GOJIRA.util.save_to_file(GOJIRA.config.output_csv_path, csv);
    }
});
