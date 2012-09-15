var test = require('tap').test;
var trumpet = require('../');
var fs = require('fs');

test('supports a mapping DSL', function (t) {
    t.plan(1);
    var html = fs.readFileSync(__dirname + '/update_target.html', 'utf8');
    
    var tr = trumpet();
    fs.createReadStream(__dirname + '/update.html').pipe(tr);

    tr.map({
        '.b span': function(html) {
            return html.toUpperCase();
        },
        
        '.c': '---',
        
        '.d': { remove: true },

        '.e': { remove: true },

        '.f': { replace: '<b>NOTHING TO SEE HERE</b>' },

        '.g': { replace: '<blink>TERRIBLE</blink>' }
    });


    var data = '';
    tr.on('data', function (buf) { data += buf; });
    
    tr.on('end', function () {
        t.equal(data, html);
    });
});
