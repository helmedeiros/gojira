var main = require('./lib/main');
var cli = require('./lib/cli');
var logger = require('./lib/logger');

module.exports = {
    run: main.run
};

if (require.main === module) {
    main.run(cli.parse(process.argv)).catch(function (error) {
        logger.error(error.message || error);
        process.exit(1);
    });
}
