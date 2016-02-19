var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');
var os = require('os');
var path = require('path');
var axios = require('axios');
var config_loader = require('../../../lib/config');
var extract = require('../../../lib/extract');
var util = require('../../../lib/util');

var DAY_MS = 60 * 60 * 24 * 1000;

describe('gojira (end-to-end)', function () {
    var stub;
    var output_path;

    beforeEach(function () {
        stub = sinon.stub(axios, 'get');
        output_path = path.join(os.tmpdir(), 'gojira-e2e-' + process.pid + '.csv');
        stub.onCall(0).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1', workingTime: [3 * DAY_MS, 8 * DAY_MS, 0] }] }
        }));
        stub.onCall(1).returns(Promise.resolve({
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
        stub.restore();
        try { fs.unlinkSync(output_path); } catch (e) { /* file may not exist */ }
    });

    it('loads config, fetches, builds csv and writes to disk', function () {
        var config = config_loader.load('./spec/fixtures/e2e_config.json');
        config.output_csv_path = output_path;

        return extract.run(config)
            .then(function (output) {
                return util.save_to_file(config.output_csv_path, output);
            })
            .then(function () {
                var written = fs.readFileSync(output_path, 'utf8');
                expect(written).to.contain('Type,Key,Summary');
                expect(written).to.contain('Story,DEMO-1');
                expect(written).to.contain('"Sample Story"');
            });
    });
});
