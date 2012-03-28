var test = require('tap').test
  , woosh = require('../')
  , fs = require('fs')


test('template one synchronously', function(t) {
  var html = fs.readFileSync(__dirname + '/fixtures/template_one_target.html', 'utf8')
  var stream = woosh(__dirname + '/fixtures/template_one.html');

  stream('.b span', function(node) {
    node.update(function(html) { return html.toUpperCase() })
  })
  ('.c', function (node) {
    node.update('---')
  })
  ('.d', function (node) {
    node.remove()
  })
  ('.e', function (node) {
    node.remove()
  })
  ('.f', function (node) {
    node.replace('<b>NOTHING TO SEE HERE</b>')
  })
  ;
  
  var data = ''
  stream.on('data', function (buf) { data += buf })

  stream.on('end', function () {
    t.equal(data, html)
    t.end()
  })
})

test('template one synchronously with options object', function(t) {
  var html = fs.readFileSync(__dirname + '/fixtures/template_one_target.html', 'utf8')
  var selectors = {
      '.b span':
        function(node) {
          node.update(function(html) { return html.toUpperCase() })
        }
    , '.c':
        function (node) {
          node.update('---')
        }
    , '.d':
        function (node) {
          node.remove()
        }
    , '.e':
        function (node) {
          node.remove()
        }
    , '.f':
        function (node) {
          node.replace('<b>NOTHING TO SEE HERE</b>')
        }
  }
  
  var stream = woosh(__dirname + '/fixtures/template_one.html', selectors);

  var data = ''
  stream.on('data', function (buf) { data += buf })

  stream.on('end', function () {
    t.equal(data, html)
    t.end()
  })
})

test('template one asynchronously', function(t) {
  var html = fs.readFileSync(__dirname + '/fixtures/template_one_target.html', 'utf8')
  var stream = woosh(__dirname + '/fixtures/template_one.html');

  stream('.b span', function(node) {
    node.update(function(html, done) { setTimeout(function() { done(html.toUpperCase()) }, 100) })
  })
  ('.c', function (node) {
    node.update('---')
  })
  ('.d', function (node) {
    node.remove()
  })
  ('.e', function (node) {
    node.remove()
  })
  ('.f', function (node) {
    node.replace(function(html, done) { setTimeout(function() { done('<b>NOTHING TO SEE HERE</b>') }, 100) })
  })
  ;
  
  var data = ''
  stream.on('data', function (buf) { data += buf })

  stream.on('end', function () {
    t.equal(data, html)
    t.end()
  })
})

test('compose 1 with no inner changes', function(t) {
  var html = fs.readFileSync(__dirname + '/fixtures/template_one_composed_target.html', 'utf8')
  var stream = woosh(__dirname + '/fixtures/template_one.html');

  stream('.b span', function(node) {
    node.update(function(html, done) {
      done(woosh(__dirname + '/fixtures/partial_one.html'))
    })
  })
  ('.c', function (node) {
    node.update('---')
  })
  ('.d', function (node) {
    node.remove()
  })
  ('.e', function (node) {
    node.remove()
  })
  ('.f', function (node) {
    node.replace(woosh(__dirname + '/fixtures/partial_two.html'))
  })
  ;
  
  var data = ''
  stream.on('data', function (buf) { data += buf })

  stream.on('end', function () {
    t.equal(data, html)
    t.end()
  })
})

return;
