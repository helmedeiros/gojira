var expect = require('chai').expect;
var child_process = require('child_process');
var path = require('path');
var pkg = require('../../../package.json');

var BIN = path.resolve(__dirname, '../../../bin/gojira');

describe('bin/gojira (spawned)', function () {
    this.timeout(5000);

    it('prints package version when --version is passed', function () {
        var output = child_process.execFileSync('node', [BIN, '--version'], { encoding: 'utf8' });
        expect(output.trim()).to.equal(pkg.version);
    });

    it('prints help when --help is passed', function () {
        var output = child_process.execFileSync('node', [BIN, '--help'], { encoding: 'utf8' });
        expect(output).to.contain('--config');
        expect(output).to.contain('--output');
        expect(output).to.contain('--format');
        expect(output).to.contain('--target');
    });
});
