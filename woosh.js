var trumpet = require('trumpet')
  , fs = require('fs')
  , Stream = require('stream').Stream
  , inherits = require('util').inherits

function Woosh(filePath, selectors) {
  var tr = trumpet()
  fs.createReadStream(filePath).pipe(tr);
  
  function stream(selector, callback) {
    // Default behaviour for inline values
    if (typeof callback !== 'function') {
      var value = callback
      callback = function(node) {
        node.update(value)
      }
    }
    tr.select(selector, callback)
    return stream
  }

  stream.__proto__ = Stream.prototype
  Stream.call(stream)

  tr.on('data', function(d) { stream.emit('data', d) })
  tr.on('end', function() { stream.emit('end') })

  if (selectors && typeof selectors == 'object') {
    for(var selector in selectors) {
      stream(selector, selectors[selector])
    }
  }

  return stream;

}

module.exports = Woosh