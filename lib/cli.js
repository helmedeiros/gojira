var Command = require('commander').Command;
var pkg = require('../package.json');

module.exports = {
    parse: function (argv) {
        var program = new Command();
        program
            .version(pkg.version)
            .option('-c, --config <path>', 'Path to project_config.json')
            .option('-o, --output <path>', 'Override output_csv_path')
            .option('-f, --format <format>', 'Override output_format (csv|json|markdown|html)')
            .option('-t, --target <target>', 'Override output_target (file|stdout)')
            .option('-p, --project <key>', 'Override project_key')
            .option('--from <date>', 'Override the from date (YYYY-MM-DD)')
            .option('--to <date>', 'Override the to date (YYYY-MM-DD)')
            .option('-q, --quiet', 'Silence logger output')
            .option('-v, --verbose', 'Enable debug logging');
        program.parse(argv);
        var log_level;
        if (program.quiet) {
            log_level = 'silent';
        } else if (program.verbose) {
            log_level = 'debug';
        }
        return {
            config_path: program.config,
            output_csv_path: program.output,
            output_format: program.format,
            output_target: program.target,
            project_key: program.project,
            from: program.from,
            to: program.to,
            log_level: log_level
        };
    }
};
