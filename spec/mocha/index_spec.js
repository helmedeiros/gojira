var expect = require('chai').expect;
var gojira = require('../../index');
var main = require('../../lib/main');

describe('index (module entry)', function () {
    it('exposes run', function () {
        expect(gojira.run).to.be.a('function');
        expect(gojira.run).to.equal(main.run);
    });

    it('exposes cli_run', function () {
        expect(gojira.cli_run).to.be.a('function');
    });
});
