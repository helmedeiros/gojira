var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');
var os = require('os');
var path = require('path');
var axios = require('axios');
var main = require('../../../lib/main');
var config_loader = require('../../../lib/config');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('gojira (end-to-end)', function () {
    var axios_stub;
    var config_stub;
    var output_path;
    var base_config;

    beforeEach(function () {
        axios_stub = sinon.stub(axios, 'get');
        output_path = path.join(os.tmpdir(), 'gojira-e2e-' + process.pid + '.csv');
        base_config = {
            jira_base_url: 'https://jira.example.com',
            control_chart: 'https://jira.example.com/secure/RapidBoard.jspa?rapidView=42',
            project_key: 'DEMO',
            csv_header_columns: 'Backlog,In Progress,Done',
            max_results: 50,
            user: 'a_user',
            password: 'a_password',
            from: '2016-01-01',
            to: '2016-01-31',
            points_per_day: 1.25,
            first_column_to_count: 1,
            output_format: 'csv',
            output_target: 'file',
            output_csv_path: output_path,
            request_timeout_ms: 30000,
            story_points_field: 'customfield_10003'
        };
        config_stub = sinon.stub(config_loader, 'load').returns(base_config);
        axios_stub.onCall(0).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1', workingTime: [3 * DAY_MS, 8 * DAY_MS, 0] }] }
        }));
        axios_stub.onCall(1).returns(Promise.resolve({
            data: {
                issues: [{
                    key: 'DEMO-1',
                    fields: {
                        issuetype: { name: 'Story' },
                        status: { name: 'Done' },
                        summary: 'Sample Story',
                        customfield_10003: 5
                    }
                }]
            }
        }));
    });

    afterEach(function () {
        axios_stub.restore();
        config_stub.restore();
        try { fs.unlinkSync(output_path); } catch (e) { /* file may not exist */ }
    });

    it('writes a csv file when output_target is file', function () {
        return main.run().then(function () {
            var written = fs.readFileSync(output_path, 'utf8');
            expect(written).to.contain('Type,Key,Summary');
            expect(written).to.contain('Story,DEMO-1');
            expect(written).to.contain('"Sample Story"');
        });
    });

    it('writes nothing to disk when output_target is stdout', function () {
        base_config.output_target = 'stdout';
        return main.run().then(function () {
            expect(fs.existsSync(output_path)).to.equal(false);
        });
    });

    it('emits an error message when the issues response is empty', function () {
        var stderr = sinon.stub(console, 'error');
        axios_stub.onCall(1).returns(Promise.resolve({ data: {} }));

        return main.run().then(function () {
            expect(stderr.firstCall.args[0]).to.contain('No issues returned');
            stderr.restore();
        });
    });
});
