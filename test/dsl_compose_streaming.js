var test = require('tap').test;
var trumpet = require('../');
var fs = require('fs');
var BufferedStream = require('bufferedstream');

test('compose with streams', function (t) {
    t.plan(1);
    var html = fs.readFileSync(__dirname + '/compose_target.html', 'utf8');

    var tr = trumpet();
    fs.createReadStream(__dirname + '/compose.html').pipe(tr);

    var tr2 = trumpet();
    fs.createReadStream(__dirname + '/partial.html').pipe(tr2);

    var tr3 = trumpet();
    fs.createReadStream(__dirname + '/partial.html').pipe(tr3);
    tr3.select('.b span', function(node) {
        node.update(function(html) {
            return html.toUpperCase();
        });
    });

    var stream = new BufferedStream();
    stream.end('<b>NOTHING TO SEE HERE</b>');

    var stream2 = new BufferedStream();
    stream2.end('<blink>TERRIBLE</blink>');

    tr.map({
        '.b span': tr2,
        '.c': tr3,
        '.d': { remove: true },
        '.e': { remove: true },
        '.f': { replace: stream },
        '.g': { replace: stream2}
    });
    
    var data = '';
    tr.on('data', function (buf) { data += buf });
    
    tr.on('end', function () {
        t.equal(data, html);
    });
});
