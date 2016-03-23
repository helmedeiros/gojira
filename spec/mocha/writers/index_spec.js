var expect = require('chai').expect;
var writers = require('../../../lib/writers');
var csv_writer = require('../../../lib/csv_writer');
var json_writer = require('../../../lib/writers/json');
var markdown_writer = require('../../../lib/writers/markdown');
var html_writer = require('../../../lib/writers/html');

describe('writers.for_format', function () {
    it('returns the csv writer for csv', function () {
        expect(writers.for_format('csv')).to.equal(csv_writer);
    });

    it('returns the json writer for json', function () {
        expect(writers.for_format('json')).to.equal(json_writer);
    });

    it('returns the markdown writer for markdown', function () {
        expect(writers.for_format('markdown')).to.equal(markdown_writer);
    });

    it('returns the html writer for html', function () {
        expect(writers.for_format('html')).to.equal(html_writer);
    });

    it('throws for an unknown format', function () {
        expect(function () {
            writers.for_format('yaml');
        }).to.throw(Error, 'No writer registered for format: yaml');
    });
});
