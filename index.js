var GOJIRA = GOJIRA || {};

GOJIRA.config = require('./lib/config').load();
GOJIRA.util = require('./lib/util');
require('./lib/http').configure({ timeout: GOJIRA.config.request_timeout_ms });
GOJIRA.extract = require('./lib/extract');

GOJIRA.extract.run(GOJIRA.config)
    .then(function (csv) {
        if (!csv) {
            console.error('No issues returned. Please check your project, component and work group settings.\n');
            return;
        }
        GOJIRA.util.save_to_file(GOJIRA.config.output_csv_path, csv);
    })
    .catch(function (error) {
        console.log(error);
    });
