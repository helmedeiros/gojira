var expect = require('chai').expect;
var sinon = require('sinon');
var axios = require('axios');
var issues_loader = require('../../../lib/issues_loader');

describe('issues_loader (integration)', function () {
    var stub;
    var config;

    beforeEach(function () {
        stub = sinon.stub(axios, 'get');
        config = {
            jira_base_url: 'https://jira.example.com',
            project_key: 'DEMO',
            component: 'Checkout',
            work_group: 'Application',
            max_results: 100,
            user: 'a_user',
            password: 'a_password'
        };
    });

    afterEach(function () {
        stub.restore();
    });

    it('returns the issues array from the response', function () {
        stub.returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1' }, { key: 'DEMO-2' }] }
        }));

        return issues_loader.load(config).then(function (issues) {
            expect(issues).to.have.length(2);
            expect(issues[0].key).to.equal('DEMO-1');
        });
    });

    it('calls the search endpoint with project, component, work group and max results', function () {
        stub.returns(Promise.resolve({ data: { issues: [] } }));

        return issues_loader.load(config).then(function () {
            var called_url = stub.firstCall.args[0];
            expect(called_url).to.contain('https://jira.example.com/rest/api/2/search');
            expect(called_url).to.contain('jql=project=DEMO');
            expect(called_url).to.contain('component="Checkout"');
            expect(called_url).to.contain('"Work Group"="Application"');
            expect(called_url).to.contain('maxResults=100');
            expect(called_url).to.contain('os_username=a_user');
        });
    });

    it('omits component and work group when not provided', function () {
        delete config.component;
        delete config.work_group;
        stub.returns(Promise.resolve({ data: { issues: [] } }));

        return issues_loader.load(config).then(function () {
            var called_url = stub.firstCall.args[0];
            expect(called_url).to.not.contain('component=');
            expect(called_url).to.not.contain('Work Group');
        });
    });

    it('propagates errors from the HTTP layer', function () {
        stub.returns(Promise.reject(new Error('boom')));

        return issues_loader.load(config).then(function () {
            throw new Error('expected rejection');
        }, function (err) {
            expect(err.message).to.equal('boom');
        });
    });

    describe('with include_changelog', function () {
        beforeEach(function () {
            config.include_changelog = true;
        });

        it('issues a changelog request per issue and attaches transitions', function () {
            stub.onCall(0).returns(Promise.resolve({
                data: { issues: [{ key: 'DEMO-1' }, { key: 'DEMO-2' }] }
            }));
            stub.onCall(1).returns(Promise.resolve({
                data: {
                    fields: { created: '2016-01-10T00:00:00Z' },
                    changelog: { histories: [
                        { created: '2016-01-11T00:00:00Z', items: [{ field: 'status', fromString: 'Backlog', toString: 'Done' }] }
                    ] }
                }
            }));
            stub.onCall(2).returns(Promise.resolve({
                data: {
                    fields: { created: '2016-01-12T00:00:00Z' },
                    changelog: { histories: [
                        { created: '2016-01-13T00:00:00Z', items: [{ field: 'status', fromString: 'Backlog', toString: 'Done' }] }
                    ] }
                }
            }));

            return issues_loader.load(config).then(function (issues) {
                expect(issues).to.have.length(2);
                expect(issues[0].transitions).to.have.length(2);
                expect(issues[0].transitions[0]).to.eql({ at: '2016-01-10T00:00:00Z', to_status: 'Backlog' });
                expect(issues[0].transitions[1]).to.eql({ at: '2016-01-11T00:00:00Z', to_status: 'Done' });
                expect(issues[1].transitions).to.have.length(2);
            });
        });

        it('falls through without enrichment when issues is null', function () {
            stub.onCall(0).returns(Promise.resolve({ data: {} }));
            return issues_loader.load(config).then(function (issues) {
                expect(issues).to.equal(undefined);
                expect(stub.callCount).to.equal(1);
            });
        });
    });
});
