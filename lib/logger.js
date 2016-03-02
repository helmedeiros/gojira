var RANKS = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };

var current_level = 'info';

function should_log(threshold) {
    return RANKS[current_level] >= RANKS[threshold];
}

module.exports = {
    set_level: function (level) {
        if (!(level in RANKS)) {
            throw new Error('Unknown log level: ' + level);
        }
        current_level = level;
    },
    info: function (message) {
        if (should_log('info')) {
            console.log(message);
        }
    },
    warn: function (message) {
        if (should_log('warn')) {
            console.log(message);
        }
    },
    error: function (message) {
        if (should_log('error')) {
            console.error(message);
        }
    },
    debug: function (message) {
        if (should_log('debug')) {
            console.log(message);
        }
    }
};
