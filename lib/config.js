var fs = require('fs');
var path = require('path');

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

        return config;
    }
};
