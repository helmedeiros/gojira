var expect = require('chai').expect;
var dates_query = require('../../lib/dates_query');

describe('dates_query', function () {
    it('returns empty when both bounds are missing', function () {
        expect(dates_query.dates_url(null, null)).to.equal('');
        expect(dates_query.dates_url('', '')).to.equal('');
    });

    it('emits only from when only from is provided', function () {
        expect(dates_query.dates_url('2015-01-01', null)).to.equal('&from=2015-01-01');
    });

    it('emits only to when only to is provided', function () {
        expect(dates_query.dates_url(null, '2015-12-31')).to.equal('&to=2015-12-31');
    });

    it('emits both bounds when both are provided', function () {
        expect(dates_query.dates_url('2015-01-01', '2015-12-31'))
            .to.equal('&from=2015-01-01&to=2015-12-31');
    });
});
