var expect = require('chai').expect;
var cli = require('../../lib/cli');

function argv(args) {
    return ['node', 'index.js'].concat(args);
}

describe('cli.parse', function () {
    it('returns undefined fields when no flags are supplied', function () {
        var options = cli.parse(argv([]));
        expect(options.config_path).to.be.undefined;
        expect(options.output_csv_path).to.be.undefined;
        expect(options.output_format).to.be.undefined;
        expect(options.output_target).to.be.undefined;
    });

    it('parses --config long form', function () {
        var options = cli.parse(argv(['--config', 'team_config.json']));
        expect(options.config_path).to.equal('team_config.json');
    });

    it('parses -c short form', function () {
        var options = cli.parse(argv(['-c', 'team_config.json']));
        expect(options.config_path).to.equal('team_config.json');
    });

    it('parses --output', function () {
        var options = cli.parse(argv(['--output', '/tmp/out.csv']));
        expect(options.output_csv_path).to.equal('/tmp/out.csv');
    });

    it('parses --format', function () {
        var options = cli.parse(argv(['--format', 'json']));
        expect(options.output_format).to.equal('json');
    });

    it('parses --target', function () {
        var options = cli.parse(argv(['--target', 'stdout']));
        expect(options.output_target).to.equal('stdout');
    });

    it('maps --quiet to log_level silent', function () {
        expect(cli.parse(argv(['--quiet'])).log_level).to.equal('silent');
    });

    it('maps --verbose to log_level debug', function () {
        expect(cli.parse(argv(['--verbose'])).log_level).to.equal('debug');
    });

    it('leaves log_level undefined when neither flag is set', function () {
        expect(cli.parse(argv([])).log_level).to.be.undefined;
    });

    it('parses --project / -p', function () {
        expect(cli.parse(argv(['--project', 'TEAM'])).project_key).to.equal('TEAM');
        expect(cli.parse(argv(['-p', 'TEAM'])).project_key).to.equal('TEAM');
    });

    it('parses --from', function () {
        expect(cli.parse(argv(['--from', '2016-01-01'])).from).to.equal('2016-01-01');
    });

    it('parses --to', function () {
        expect(cli.parse(argv(['--to', '2016-12-31'])).to).to.equal('2016-12-31');
    });

    it('leaves project_key, from and to undefined when not provided', function () {
        var options = cli.parse(argv([]));
        expect(options.project_key).to.be.undefined;
        expect(options.from).to.be.undefined;
        expect(options.to).to.be.undefined;
    });

    it('parses multiple flags together', function () {
        var options = cli.parse(argv([
            '-c', 'team.json',
            '-o', '/tmp/out.json',
            '-f', 'json',
            '-t', 'stdout'
        ]));
        expect(options.config_path).to.equal('team.json');
        expect(options.output_csv_path).to.equal('/tmp/out.json');
        expect(options.output_format).to.equal('json');
        expect(options.output_target).to.equal('stdout');
    });
});
