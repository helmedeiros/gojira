var writers = require('../../lib/writers');
var csv_writer = require('../../lib/csv_writer');
var json_writer = require('../../lib/writers/json');
var markdown_writer = require('../../lib/writers/markdown');

describe('writers.for_format', function () {
    it('returns the csv writer for csv', function () {
        expect(writers.for_format('csv')).toBe(csv_writer);
    });

    it('returns the json writer for json', function () {
        expect(writers.for_format('json')).toBe(json_writer);
    });

    it('returns the markdown writer for markdown', function () {
        expect(writers.for_format('markdown')).toBe(markdown_writer);
    });

    it('throws for an unknown format', function () {
        expect(function () {
            writers.for_format('yaml');
        }).toThrow(new Error('No writer registered for format: yaml'));
    });
});
