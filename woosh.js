var trumpet = require('trumpet')
  , fs = require('fs')
  , Stream = require('stream').Stream
  , inherits = require('util').inherits

function Woosh(filePath) {
  var tr = trumpet()
  fs.createReadStream(filePath).pipe(tr);
  
  function stream(selector, callback) {
    tr.select(selector, callback)
    return stream
  }

  stream.__proto__ = Stream.prototype
  Stream.call(stream)

  tr.on('data', function(d) { stream.emit('data', d) })
  tr.on('end', function() { stream.emit('end') })

  return stream;

}

module.exports = Woosh