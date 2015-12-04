var fs = require('fs');
var path = require('path');

module.exports = {
    load: function (config_path) {
        var resolved = path.resolve(config_path || './project_config.json');
        var raw = fs.readFileSync(resolved, 'utf8');
        return JSON.parse(raw);
    }
};
