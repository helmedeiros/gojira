var expect = require('chai').expect;
var fs = require('fs');
var os = require('os');
var path = require('path');
var util = require('../../lib/util');

describe('util.save_to_file', function () {
    var target;

    beforeEach(function () {
        target = path.join(os.tmpdir(), 'gojira-util-spec-' + process.pid + '.txt');
    });

    afterEach(function () {
        try { fs.unlinkSync(target); } catch (e) { /* file may not exist */ }
    });

    it('returns a Promise that resolves once the file is written', function () {
        return util.save_to_file(target, 'hello').then(function () {
            expect(fs.readFileSync(target, 'utf8')).to.equal('hello');
        });
    });

    it('rejects when the directory does not exist', function () {
        return util.save_to_file('/nonexistent-dir-' + Date.now() + '/out.txt', 'x')
            .then(function () {
                throw new Error('expected rejection');
            }, function (err) {
                expect(err).to.be.an.instanceof(Error);
                expect(err.code).to.equal('ENOENT');
            });
    });
});
