var expect = require('chai').expect;
var sinon = require('sinon');
var axios = require('axios');
var paginated = require('../../lib/paginated');

describe('paginated.load', function () {
    var stub;

    beforeEach(function () {
        stub = sinon.stub(axios, 'get');
    });

    afterEach(function () {
        stub.restore();
    });

    function url_for(start_at) {
        return 'https://jira.example.com/search?startAt=' + start_at;
    }

    it('returns the first page when total fits in one page', function () {
        stub.returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1' }, { key: 'DEMO-2' }], total: 2 }
        }));
        return paginated.load(url_for).then(function (issues) {
            expect(issues).to.have.length(2);
            expect(stub.callCount).to.equal(1);
        });
    });

    it('concatenates pages until total is reached', function () {
        stub.onCall(0).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1' }, { key: 'DEMO-2' }], total: 5 }
        }));
        stub.onCall(1).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-3' }, { key: 'DEMO-4' }], total: 5 }
        }));
        stub.onCall(2).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-5' }], total: 5 }
        }));
        return paginated.load(url_for).then(function (issues) {
            expect(issues).to.have.length(5);
            expect(stub.callCount).to.equal(3);
            expect(stub.getCall(1).args[0]).to.contain('startAt=2');
            expect(stub.getCall(2).args[0]).to.contain('startAt=4');
        });
    });

    it('stops on an empty page even if total is larger', function () {
        stub.onCall(0).returns(Promise.resolve({
            data: { issues: [{ key: 'DEMO-1' }], total: 10 }
        }));
        stub.onCall(1).returns(Promise.resolve({
            data: { issues: [], total: 10 }
        }));
        return paginated.load(url_for).then(function (issues) {
            expect(issues).to.have.length(1);
            expect(stub.callCount).to.equal(2);
        });
    });

    it('returns empty array when the response has no issues key', function () {
        stub.returns(Promise.resolve({ data: {} }));
        return paginated.load(url_for).then(function (issues) {
            expect(issues).to.eql([]);
            expect(stub.callCount).to.equal(1);
        });
    });
});
