var config_loader = require('./config');
var http = require('./http');
var extract = require('./extract');
var util = require('./util');

function emit(config, output) {
    if (!output) {
        console.error('No issues returned. Please check your project, component and work group settings.\n');
        return;
    }
    if (config.output_target === 'stdout') {
        console.log(output);
        return;
    }
    return util.save_to_file(config.output_csv_path, output);
}

module.exports = {
    run: function (config_path) {
        var config = config_loader.load(config_path);
        http.configure({ timeout: config.request_timeout_ms });
        return extract.run(config).then(function (output) {
            return emit(config, output);
        });
    }
};
