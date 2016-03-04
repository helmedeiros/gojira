var cli = require('./lib/cli');
var main = require('./lib/main');
var logger = require('./lib/logger');

main.run(cli.parse(process.argv)).catch(function (error) {
    logger.error(error.message || error);
    process.exit(1);
});
