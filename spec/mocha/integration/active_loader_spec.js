var expect = require('chai').expect;
var sinon = require('sinon');
var axios = require('axios');
var active_loader = require('../../../lib/active_loader');

describe('active_loader (integration)', function () {
    var stub;
    var config;

    beforeEach(function () {
        stub = sinon.stub(axios, 'get');
        config = {
            jira_base_url: 'https://jira.example.com',
            project_key: 'DEMO',
            user: 'a_user',
            password: 'a_password',
            max_results: 50
        };
    });

    afterEach(function () {
        stub.restore();
    });

    it('queries with status!=Done', function () {
        stub.returns(Promise.resolve({ data: { issues: [] } }));
        return active_loader.load(config).then(function () {
            var called_url = stub.firstCall.args[0];
            expect(called_url).to.contain('jql=project=DEMO+and+status!=Done');
        });
    });

    it('returns the array of in-progress issues', function () {
        stub.returns(Promise.resolve({
            data: { issues: [
                { key: 'DEMO-501', fields: { status: { name: 'In Progress' } } },
                { key: 'DEMO-502', fields: { status: { name: 'Code Review' } } }
            ] }
        }));
        return active_loader.load(config).then(function (issues) {
            expect(issues).to.have.length(2);
            expect(issues[0].key).to.equal('DEMO-501');
        });
    });

    it('returns an empty array when the response has no issues', function () {
        stub.returns(Promise.resolve({ data: {} }));
        return active_loader.load(config).then(function (issues) {
            expect(issues).to.eql([]);
        });
    });

    it('fans out changelog requests when include_changelog is true', function () {
        config.include_changelog = true;
        stub.onCall(0).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-501', fields: { status: { name: 'In Progress' } } }] }
        }));
        stub.onCall(1).returns(Promise.resolve({
            data: {
                fields: { created: '2016-04-01T00:00:00Z' },
                changelog: { histories: [
                    { created: '2016-04-05T00:00:00Z', items: [{ field: 'status', fromString: 'Backlog', toString: 'In Progress' }] }
                ] }
            }
        }));
        return active_loader.load(config).then(function (issues) {
            expect(issues[0].transitions).to.have.length(2);
            expect(issues[0].transitions[1].to_status).to.equal('In Progress');
        });
    });
});
