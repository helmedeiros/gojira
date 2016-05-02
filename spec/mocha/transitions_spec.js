var expect = require('chai').expect;
var transitions = require('../../lib/transitions');

var DAY_MS = 24 * 60 * 60 * 1000;

describe('transitions.for_line', function () {
    it('returns null when resolved_at is missing', function () {
        expect(transitions.for_line({ times_array: [1, 2, 3] })).to.equal(null);
    });

    it('returns null when times_array is missing', function () {
        expect(transitions.for_line({ resolved_at: '2016-01-10T00:00:00Z' })).to.equal(null);
    });

    it('returns null when resolved_at is unparseable', function () {
        expect(transitions.for_line({ resolved_at: 'not-a-date', times_array: [1] })).to.equal(null);
    });

    it('walks back through columns from resolved_at', function () {
        var resolved = Date.UTC(2016, 0, 20);
        var line = {
            resolved_at: new Date(resolved).toISOString(),
            times_array: [3, 5, 2, 1, 0]
        };
        var entered = transitions.for_line(line);
        expect(entered[4]).to.equal(resolved);
        expect(entered[3]).to.equal(resolved - 1 * DAY_MS);
        expect(entered[2]).to.equal(resolved - 3 * DAY_MS);
        expect(entered[1]).to.equal(resolved - 8 * DAY_MS);
        expect(entered[0]).to.equal(resolved - 11 * DAY_MS);
    });

    it('returns one timestamp per column', function () {
        var line = {
            resolved_at: '2016-01-10T00:00:00.000Z',
            times_array: [1, 2, 3]
        };
        expect(transitions.for_line(line)).to.have.length(3);
    });
});

describe('transitions.for_lines', function () {
    it('drops lines that cannot produce transitions', function () {
        var lines = [
            { resolved_at: '2016-01-10T00:00:00.000Z', times_array: [1, 1] },
            { times_array: [1, 1] },
            { resolved_at: '2016-01-15T00:00:00.000Z' }
        ];
        expect(transitions.for_lines(lines)).to.have.length(1);
    });

    it('returns an empty array for no input', function () {
        expect(transitions.for_lines(null)).to.eql([]);
        expect(transitions.for_lines([])).to.eql([]);
    });
});

describe('transitions.for_line with real changelog events', function () {
    var columns = ['Backlog', 'In Progress', 'Done'];

    it('uses real transition timestamps when all columns are matched', function () {
        var line = {
            resolved_at: '2016-02-01T00:00:00Z',
            times_array: [1, 5, 0],
            transitions: [
                { at: '2016-01-10T09:00:00Z', to_status: 'Backlog' },
                { at: '2016-01-12T09:00:00Z', to_status: 'In Progress' },
                { at: '2016-01-15T09:00:00Z', to_status: 'Done' }
            ]
        };
        var entered = transitions.for_line(line, columns);
        expect(entered[0]).to.equal(Date.parse('2016-01-10T09:00:00Z'));
        expect(entered[1]).to.equal(Date.parse('2016-01-12T09:00:00Z'));
        expect(entered[2]).to.equal(Date.parse('2016-01-15T09:00:00Z'));
    });

    it('takes the FIRST event when a column is entered multiple times', function () {
        var line = {
            transitions: [
                { at: '2016-01-10T00:00:00Z', to_status: 'Backlog' },
                { at: '2016-01-12T00:00:00Z', to_status: 'In Progress' },
                { at: '2016-01-13T00:00:00Z', to_status: 'Backlog' },
                { at: '2016-01-14T00:00:00Z', to_status: 'In Progress' },
                { at: '2016-01-15T00:00:00Z', to_status: 'Done' }
            ]
        };
        var entered = transitions.for_line(line, columns);
        expect(entered[1]).to.equal(Date.parse('2016-01-12T00:00:00Z'));
    });

    it('falls back to back-derivation when a column has no matching event', function () {
        var resolved = Date.UTC(2016, 0, 20);
        var DAY = 24 * 60 * 60 * 1000;
        var line = {
            resolved_at: new Date(resolved).toISOString(),
            times_array: [2, 3, 0],
            transitions: [
                { at: '2016-01-10T00:00:00Z', to_status: 'Backlog' }
            ]
        };
        var entered = transitions.for_line(line, columns);
        expect(entered[2]).to.equal(resolved);
        expect(entered[1]).to.equal(resolved - 3 * DAY);
        expect(entered[0]).to.equal(resolved - 5 * DAY);
    });

    it('falls back when columns are not supplied', function () {
        var resolved = Date.UTC(2016, 0, 20);
        var line = {
            resolved_at: new Date(resolved).toISOString(),
            times_array: [1, 1, 0],
            transitions: [
                { at: '2016-01-10T00:00:00Z', to_status: 'Backlog' },
                { at: '2016-01-12T00:00:00Z', to_status: 'In Progress' },
                { at: '2016-01-15T00:00:00Z', to_status: 'Done' }
            ]
        };
        var entered = transitions.for_line(line);
        expect(entered[2]).to.equal(resolved);
    });
});
