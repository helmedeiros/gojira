var expect = require('chai').expect;
var svg = require('../../../lib/charts/svg');

describe('charts/svg', function () {
    describe('root', function () {
        it('emits an svg element with viewBox and dimensions', function () {
            var out = svg.root(400, 200, '<g/>');
            expect(out).to.contain('<svg xmlns="http://www.w3.org/2000/svg"');
            expect(out).to.contain('viewBox="0 0 400 200"');
            expect(out).to.contain('width="400"');
            expect(out).to.contain('height="200"');
            expect(out).to.contain('<g/>');
            expect(out).to.match(/<\/svg>$/);
        });
    });

    describe('rect', function () {
        it('emits a rect with x/y/width/height/fill', function () {
            var out = svg.rect({ x: 5, y: 10, width: 20, height: 30, fill: '#0366d6' });
            expect(out).to.equal('<rect x="5" y="10" width="20" height="30" fill="#0366d6"/>');
        });

        it('omits unset attributes', function () {
            var out = svg.rect({ x: 0, y: 0, width: 1, height: 1 });
            expect(out).to.not.contain('fill=');
            expect(out).to.not.contain('stroke=');
        });
    });

    describe('line', function () {
        it('emits a line with stroke and stroke-width', function () {
            var out = svg.line({ x1: 0, y1: 0, x2: 100, y2: 0, stroke: '#000', stroke_width: 2 });
            expect(out).to.contain('x1="0"');
            expect(out).to.contain('x2="100"');
            expect(out).to.contain('stroke="#000"');
            expect(out).to.contain('stroke-width="2"');
        });
    });

    describe('text', function () {
        it('emits a text element with content and anchor', function () {
            var out = svg.text({ x: 50, y: 20, text: 'hello', anchor: 'middle', font_size: 12 });
            expect(out).to.contain('x="50"');
            expect(out).to.contain('text-anchor="middle"');
            expect(out).to.contain('font-size="12"');
            expect(out).to.contain('>hello</text>');
        });

        it('escapes XML special characters in text content', function () {
            var out = svg.text({ x: 0, y: 0, text: '<script>alert("x") & y</script>' });
            expect(out).to.contain('&lt;script&gt;');
            expect(out).to.contain('&quot;x&quot;');
            expect(out).to.contain('&amp;');
        });
    });

    describe('escape', function () {
        it('handles ampersands, brackets and quotes', function () {
            expect(svg.escape('a & <b> "c"')).to.equal('a &amp; &lt;b&gt; &quot;c&quot;');
        });
    });
});
