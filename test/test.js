var test = require('tap').test
  , woosh = require('../')

test('template one string', function(t) {
  var stream = woosh(__dirname + '/fixtures/template_one.html');

  stream.select('.b span', function (node) {
    node.update(function (html) {
      return html.toUpperCase();
    });
  });
  
  tr.select('.c', function (node) {
    node.update('---');
  });
  
  tr.select('.d', function (node) {
    node.remove();
  });
  
  tr.select('.e', function (node) {
    node.remove();
  });
  
  tr.select('.f', function (node) {
    node.replace('<b>NOTHING TO SEE HERE</b>');
  });
  
  var data = '';
  tr.on('data', function (buf) { data += buf });

  tr.on('end', function () {
    t.equal(data, html);
    t.end();
  });
})