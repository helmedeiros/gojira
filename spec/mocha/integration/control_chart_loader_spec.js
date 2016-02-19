var expect = require('chai').expect;
var sinon = require('sinon');
var axios = require('axios');
var control_chart_loader = require('../../../lib/control_chart_loader');

describe('control_chart_loader (integration)', function () {
    var stub;
    var config;

    beforeEach(function () {
        stub = sinon.stub(axios, 'get');
        config = {
            jira_base_url: 'https://jira.example.com',
            control_chart: 'https://jira.example.com/secure/RapidBoard.jspa?rapidView=42&swimlane=10&swimlane=11',
            user: 'a_user',
            password: 'a_password',
            from: '2016-01-01',
            to: '2016-01-31'
        };
    });

    afterEach(function () {
        stub.restore();
    });

    it('returns the issues array from the response', function () {
        stub.returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1', workingTime: [0, 0, 0] }] }
        }));

        return control_chart_loader.load(config).then(function (issues) {
            expect(issues).to.have.length(1);
            expect(issues[0].key).to.equal('DEMO-1');
        });
    });

    it('calls the correct Jira control chart URL', function () {
        stub.returns(Promise.resolve({ data: { issues: [] } }));

        return control_chart_loader.load(config).then(function () {
            var called_url = stub.firstCall.args[0];
            expect(called_url).to.contain('https://jira.example.com/rest/greenhopper/1.0/rapid/charts/controlchart');
            expect(called_url).to.contain('rapidViewId=42');
            expect(called_url).to.contain('swimlaneId=10');
            expect(called_url).to.contain('swimlaneId=11');
            expect(called_url).to.contain('from=2016-01-01');
            expect(called_url).to.contain('to=2016-01-31');
            expect(called_url).to.contain('os_username=a_user');
        });
    });

    it('propagates errors from the HTTP layer', function () {
        stub.returns(Promise.reject(new Error('network down')));

        return control_chart_loader.load(config).then(function () {
            throw new Error('expected rejection');
        }, function (err) {
            expect(err.message).to.equal('network down');
        });
    });
});
