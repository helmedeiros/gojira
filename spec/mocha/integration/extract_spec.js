var expect = require('chai').expect;
var sinon = require('sinon');
var axios = require('axios');
var extract = require('../../../lib/extract');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('extract (integration)', function () {
    var stub;
    var config;

    beforeEach(function () {
        stub = sinon.stub(axios, 'get');
        config = {
            jira_base_url: 'https://jira.example.com',
            project_key: 'DEMO',
            control_chart: 'https://jira.example.com/secure/RapidBoard.jspa?rapidView=42',
            csv_header_columns: 'Backlog,In Progress,Done',
            max_results: 50,
            user: 'a_user',
            password: 'a_password',
            from: '2016-01-01',
            to: '2016-01-31',
            points_per_day: 1.25,
            first_column_to_count: 1,
            output_format: 'csv',
            story_points_field: 'customfield_10003'
        };
        stub.onCall(0).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1', workingTime: [2 * DAY_MS, 5 * DAY_MS, 0] }] }
        }));
        stub.onCall(1).returns(Promise.resolve({
            data: {
                issues: [{
                    key: 'DEMO-1',
                    fields: {
                        issuetype: { name: 'Story' },
                        status: { name: 'Done' },
                        summary: 'Sample',
                        customfield_10003: 4
                    }
                }]
            }
        }));
    });

    afterEach(function () {
        stub.restore();
    });

    it('produces a csv string when output_format is csv', function () {
        return extract.run(config).then(function (output) {
            expect(output).to.contain('Type,Key,Summary');
            expect(output).to.contain('Story,DEMO-1');
        });
    });

    it('produces a json array when output_format is json', function () {
        config.output_format = 'json';
        return extract.run(config).then(function (output) {
            var parsed = JSON.parse(output);
            expect(parsed).to.have.length(1);
            expect(parsed[0].key).to.equal('DEMO-1');
        });
    });

    it('produces a markdown table when output_format is markdown', function () {
        config.output_format = 'markdown';
        return extract.run(config).then(function (output) {
            expect(output).to.contain('| Type | Key | Summary');
            expect(output).to.contain('| DEMO-1 |');
        });
    });

    it('returns null when the issues response has no issues key', function () {
        stub.onCall(1).returns(Promise.resolve({ data: {} }));
        return extract.run(config).then(function (output) {
            expect(output).to.equal(null);
        });
    });

    it('rejects when the control chart load fails', function () {
        stub.onCall(0).returns(Promise.reject(new Error('control chart down')));
        return extract.run(config).then(function () {
            throw new Error('expected rejection');
        }, function (err) {
            expect(err.message).to.equal('control chart down');
        });
    });
});
