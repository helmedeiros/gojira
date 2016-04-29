var expect = require('chai').expect;
var parser = require('../../lib/changelog_parser');

function history(created, items) {
    return { created: created, items: items };
}

function status_item(from, to) {
    return { field: 'status', fromString: from, toString: to };
}

describe('changelog_parser.extract', function () {
    it('returns an empty array when the issue is null', function () {
        expect(parser.extract(null)).to.eql([]);
    });

    it('returns an empty array when there is no changelog', function () {
        expect(parser.extract({ fields: { created: '2016-01-10T00:00:00Z' } })).to.eql([]);
    });

    it('skips non-status items in the changelog', function () {
        var issue = {
            fields: { created: '2016-01-10T00:00:00Z' },
            changelog: { histories: [
                history('2016-01-11T09:00:00Z', [{ field: 'assignee', toString: 'someone' }])
            ] }
        };
        expect(parser.extract(issue)).to.eql([]);
    });

    it('returns one event per status transition', function () {
        var issue = {
            fields: { created: '2016-01-10T00:00:00Z' },
            changelog: { histories: [
                history('2016-01-11T09:00:00Z', [status_item('Backlog', 'In Progress')]),
                history('2016-01-15T09:00:00Z', [status_item('In Progress', 'Done')])
            ] }
        };
        var events = parser.extract(issue);
        expect(events).to.have.length(3);
        expect(events[0]).to.eql({ at: '2016-01-10T00:00:00Z', to_status: 'Backlog' });
        expect(events[1]).to.eql({ at: '2016-01-11T09:00:00Z', to_status: 'In Progress' });
        expect(events[2]).to.eql({ at: '2016-01-15T09:00:00Z', to_status: 'Done' });
    });

    it('sorts events chronologically even when histories are out of order', function () {
        var issue = {
            fields: { created: '2016-01-10T00:00:00Z' },
            changelog: { histories: [
                history('2016-01-15T09:00:00Z', [status_item('In Progress', 'Done')]),
                history('2016-01-11T09:00:00Z', [status_item('Backlog', 'In Progress')])
            ] }
        };
        var events = parser.extract(issue);
        var times = events.map(function (e) { return Date.parse(e.at); });
        expect(times[0]).to.be.lessThan(times[1]);
        expect(times[1]).to.be.lessThan(times[2]);
    });

    it('omits the initial state when fields.created is missing', function () {
        var issue = {
            changelog: { histories: [
                history('2016-01-11T09:00:00Z', [status_item('Backlog', 'In Progress')])
            ] }
        };
        var events = parser.extract(issue);
        expect(events).to.have.length(1);
        expect(events[0].to_status).to.equal('In Progress');
    });
});
