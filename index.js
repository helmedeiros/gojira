var GOJIRA = GOJIRA || {};

GOJIRA.config = require('./lib/config').load();
GOJIRA.util = require('./lib/util');
require('./lib/http').configure({ timeout: GOJIRA.config.request_timeout_ms });
GOJIRA.extract = require('./lib/extract');

GOJIRA.extract.run(GOJIRA.config)
    .then(function (output) {
        if (!output) {
            console.error('No issues returned. Please check your project, component and work group settings.\n');
            return;
        }
        if (GOJIRA.config.output_target === 'stdout') {
            console.log(output);
            return;
        }
        return GOJIRA.util.save_to_file(GOJIRA.config.output_csv_path, output);
    })
    .catch(function (error) {
        console.log(error);
    });
