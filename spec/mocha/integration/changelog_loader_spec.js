var expect = require('chai').expect;
var sinon = require('sinon');
var axios = require('axios');
var changelog_loader = require('../../../lib/changelog_loader');

describe('changelog_loader (integration)', function () {
    var stub;
    var config;

    beforeEach(function () {
        stub = sinon.stub(axios, 'get');
        config = {
            jira_base_url: 'https://jira.example.com',
            user: 'a_user',
            password: 'a_password'
        };
    });

    afterEach(function () {
        stub.restore();
    });

    it('calls the expand=changelog endpoint for the issue key', function () {
        stub.returns(Promise.resolve({
            data: {
                fields: { created: '2016-01-10T00:00:00Z' },
                changelog: { histories: [] }
            }
        }));

        return changelog_loader.load(config, 'DEMO-1').then(function () {
            var called_url = stub.firstCall.args[0];
            expect(called_url).to.contain('https://jira.example.com/rest/api/2/issue/DEMO-1');
            expect(called_url).to.contain('expand=changelog');
            expect(called_url).to.contain('os_username=a_user');
        });
    });

    it('returns the parsed status transitions', function () {
        stub.returns(Promise.resolve({
            data: {
                fields: { created: '2016-01-10T00:00:00Z' },
                changelog: { histories: [
                    {
                        created: '2016-01-11T09:00:00Z',
                        items: [{ field: 'status', fromString: 'Backlog', toString: 'In Progress' }]
                    }
                ] }
            }
        }));

        return changelog_loader.load(config, 'DEMO-1').then(function (events) {
            expect(events).to.have.length(2);
            expect(events[0].to_status).to.equal('Backlog');
            expect(events[1].to_status).to.equal('In Progress');
        });
    });

    it('propagates errors from the HTTP layer', function () {
        stub.returns(Promise.reject(new Error('boom')));

        return changelog_loader.load(config, 'DEMO-1').then(function () {
            throw new Error('expected rejection');
        }, function (err) {
            expect(err.message).to.equal('boom');
        });
    });
});
