const csv_writer = require('../csv_writer');
const json_writer = require('./json');
const markdown_writer = require('./markdown');

const WRITERS = {
    csv: csv_writer,
    json: json_writer,
    markdown: markdown_writer
};

module.exports = {
    for_format: function (format) {
        const writer = WRITERS[format];
        if (!writer) {
            throw new Error('No writer registered for format: ' + format);
        }
        return writer;
    }
};
