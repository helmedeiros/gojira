var expect = require('chai').expect;
var sinon = require('sinon');
var logger = require('../../lib/logger');

describe('logger', function () {
    var log_stub;
    var err_stub;

    beforeEach(function () {
        log_stub = sinon.stub(console, 'log');
        err_stub = sinon.stub(console, 'error');
        logger.set_level('info');
    });

    afterEach(function () {
        log_stub.restore();
        err_stub.restore();
        logger.set_level('info');
    });

    it('emits info at default level', function () {
        logger.info('hello');
        expect(log_stub.firstCall.args[0]).to.equal('hello');
    });

    it('emits errors to stderr', function () {
        logger.error('boom');
        expect(err_stub.firstCall.args[0]).to.equal('boom');
    });

    it('suppresses debug at info level', function () {
        logger.debug('deep');
        expect(log_stub.called).to.equal(false);
    });

    it('emits debug when level is debug', function () {
        logger.set_level('debug');
        logger.debug('deep');
        expect(log_stub.firstCall.args[0]).to.equal('deep');
    });

    it('silent level suppresses everything', function () {
        logger.set_level('silent');
        logger.info('hi');
        logger.warn('uh');
        logger.error('no');
        logger.debug('zz');
        expect(log_stub.called).to.equal(false);
        expect(err_stub.called).to.equal(false);
    });

    it('warn passes the info threshold but is hidden at error level', function () {
        logger.set_level('warn');
        logger.info('hi');
        logger.warn('uh');
        expect(log_stub.callCount).to.equal(1);
        expect(log_stub.firstCall.args[0]).to.equal('uh');
    });

    it('throws on unknown levels', function () {
        expect(function () { logger.set_level('chatty'); })
            .to.throw(Error, 'Unknown log level: chatty');
    });
});
