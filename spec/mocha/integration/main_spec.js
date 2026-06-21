var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');
var os = require('os');
var path = require('path');
var axios = require('axios');
var main = require('../../../lib/main');
var config_loader = require('../../../lib/config');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('main.run (integration)', function () {
    var axios_stub;
    var config_stub;
    var base_config;
    var output_path;

    beforeEach(function () {
        axios_stub = sinon.stub(axios, 'get');
        output_path = path.join(os.tmpdir(), 'gojira-main-' + process.pid + '.csv');
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
            output_csv_path: '/tmp/should-not-be-used.csv',
            request_timeout_ms: 30000,
            story_points_field: 'customfield_10003'
        };
        config_stub = sinon.stub(config_loader, 'load').returns(base_config);
        axios_stub.onCall(0).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1', workingTime: [1 * DAY_MS, 2 * DAY_MS, 0] }] }
        }));
        axios_stub.onCall(1).returns(Promise.resolve({
            data: {
                issues: [{
                    key: 'DEMO-1',
                    fields: {
                        issuetype: { name: 'Story' },
                        status: { name: 'Done' },
                        summary: 'Sample',
                        customfield_10003: 2
                    }
                }]
            }
        }));
    });

    afterEach(function () {
        axios_stub.restore();
        config_stub.restore();
        try { fs.unlinkSync(output_path); } catch (e) { /* may not exist */ }
    });

    it('writes to output_csv_path override', function () {
        return main.run({ output_csv_path: output_path }).then(function () {
            expect(fs.existsSync(output_path)).to.equal(true);
        });
    });

    it('switches to json output when output_format is overridden', function () {
        var stdout = sinon.stub(process.stdout, 'write');
        return main.run({ output_format: 'json', output_target: 'stdout' }).then(function () {
            var written = stdout.firstCall.args[0];
            stdout.restore();
            expect(function () { JSON.parse(written); }).to.not.throw();
        });
    });

    it('passes config_path through to the config loader', function () {
        return main.run({ config_path: 'custom.json', output_csv_path: output_path }).then(function () {
            expect(config_stub.firstCall.args[0]).to.equal('custom.json');
        });
    });

    it('ignores undefined option fields', function () {
        return main.run({ output_csv_path: output_path, output_format: undefined }).then(function () {
            expect(base_config.output_format).to.equal('csv');
        });
    });

    it('honors --project / project_key override', function () {
        return main.run({ output_csv_path: output_path, project_key: 'TEAM' }).then(function () {
            expect(base_config.project_key).to.equal('TEAM');
        });
    });

    it('honors --from and --to overrides', function () {
        return main.run({
            output_csv_path: output_path,
            from: '2016-02-01',
            to: '2016-02-28'
        }).then(function () {
            expect(base_config.from).to.equal('2016-02-01');
            expect(base_config.to).to.equal('2016-02-28');
        });
    });

    it('writes one SVG per chart into charts_dir', function () {
        var charts_dir = path.join(os.tmpdir(), 'gojira-charts-' + process.pid);
        return main.run({ output_csv_path: output_path, charts_dir: charts_dir })
            .then(function () {
                var files = fs.readdirSync(charts_dir).sort();
                expect(files).to.eql([
                    'cfd.svg',
                    'cycle_time_histogram.svg',
                    'cycle_time_scatter.svg',
                    'lead_time_histogram.svg',
                    'throughput_by_week.svg',
                    'time_in_column.svg'
                ]);
                files.forEach(function (name) {
                    var content = fs.readFileSync(path.join(charts_dir, name), 'utf8');
                    expect(content).to.contain('<svg');
                });
                files.forEach(function (name) { fs.unlinkSync(path.join(charts_dir, name)); });
                fs.rmdirSync(charts_dir);
            });
    });

    it('also writes aging_wip.svg when include_aging_wip is on', function () {
        var charts_dir = path.join(os.tmpdir(), 'gojira-charts-aging-' + process.pid);
        base_config.include_aging_wip = true;
        axios_stub.onCall(2).returns(Promise.resolve({
            data: { issues: [{
                key: 'DEMO-501',
                fields: {
                    status: { name: 'In Progress' },
                    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                }
            }] }
        }));
        return main.run({ output_csv_path: output_path, charts_dir: charts_dir })
            .then(function () {
                var files = fs.readdirSync(charts_dir).sort();
                expect(files).to.include('aging_wip.svg');
                expect(fs.readFileSync(path.join(charts_dir, 'aging_wip.svg'), 'utf8')).to.contain('DEMO-501');
                files.forEach(function (name) { fs.unlinkSync(path.join(charts_dir, name)); });
                fs.rmdirSync(charts_dir);
            });
    });
});
