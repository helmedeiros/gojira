var expect = require('chai').expect;
var sinon = require('sinon');
var axios = require('axios');
var http = require('../../lib/http');

describe('http.get', function () {
    var stub;

    beforeEach(function () {
        stub = sinon.stub(axios, 'get');
    });

    afterEach(function () {
        stub.restore();
    });

    it('resolves with the parsed JSON body on success', function () {
        stub.returns(Promise.resolve({ data: { issues: [{ key: 'DEMO-1' }] } }));

        return http.get('https://jira.example.com/rest/api/2/search').then(function (data) {
            expect(data.issues).to.eql([{ key: 'DEMO-1' }]);
        });
    });

    it('passes the configured options on each call', function () {
        stub.returns(Promise.resolve({ data: {} }));

        return http.get('https://jira.example.com/rest/api/2/search').then(function () {
            var options = stub.firstCall.args[1];
            expect(options).to.have.property('httpsAgent');
            expect(options).to.have.property('timeout');
        });
    });

    it('rejects when axios rejects', function () {
        stub.returns(Promise.reject(new Error('boom')));

        return http.get('https://jira.example.com/rest/api/2/search')
            .then(function () {
                throw new Error('expected rejection');
            }, function (err) {
                expect(err.message).to.equal('boom');
            });
    });

    it('applies HTTP Basic auth when configured with user/password', function () {
        http.configure({ user: 'me@example.com', password: 'a_token' });
        stub.returns(Promise.resolve({ data: {} }));

        return http.get('https://jira.example.com/rest/api/2/search').then(function () {
            var options = stub.firstCall.args[1];
            expect(options.auth).to.eql({ username: 'me@example.com', password: 'a_token' });
            http.configure({});
        });
    });

    it('omits the auth option entirely when no user is configured', function () {
        http.configure({});
        stub.returns(Promise.resolve({ data: {} }));

        return http.get('https://jira.example.com/rest/api/2/search').then(function () {
            var options = stub.firstCall.args[1];
            expect(options.auth).to.be.undefined;
        });
    });
});
