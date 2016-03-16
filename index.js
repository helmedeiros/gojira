var main = require('./lib/main');
var cli = require('./lib/cli');
var logger = require('./lib/logger');

function cli_run() {
    return main.run(cli.parse(process.argv)).catch(function (error) {
        logger.error(error.message || error);
        process.exit(1);
    });
}

module.exports = {
    run: main.run,
    cli_run: cli_run
};

if (require.main === module) {
    cli_run();
}
