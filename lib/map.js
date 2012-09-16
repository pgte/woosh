var Stream = require('stream').Stream;
var BufferedStream = require('bufferedstream');

var actions = ['remove', 'replace', 'update'];

function actionFromVal(val) {
  var remainingActions = actions.filter(function(action) {
    return val.hasOwnProperty(action);
  });
  if (! remainingActions.length) return;
  if (remainingActions.length > 1) {
    try {
      throw new Error('Ambiguous action, don\'t know what to do with' + JSON.stringify(val));
    } catch (e) {
      throw new Error('Ambiguous action, don\'t know what to do with it:' + val.toString());
    }
  }
  return remainingActions[0];
}

function handleStream(selector, action, stream) {
  var buffer = [], ended = false;
  stream.on('data', function(d) { buffer.push(d); });
  stream.on('end', function() { ended = true; });

  this.select(selector, function(node) {
    node[action](function(html) {
      var index = 0;
      var bs = new BufferedStream();
      
      (function flush() {
        if (buffer.length > index) {
          bs.write(buffer[index]);
          index ++;
        }
        if (buffer.length > index || ! ended) {
          process.nextTick(flush);
        } else {
          bs.end();
        }
      }());

      return bs;
    });
  });
}

function map(mapping) {
  var self = this;
  
  if (typeof mapping !== 'object') {
    throw new Error('Map argument should be object literal');
  }

  Object.keys(mapping).forEach(function(selector) {
    var val = mapping[selector];

    switch (typeof val) {
      
      case 'string':
      case 'function':

        self.update(selector, val);

        break;

      case 'object':

        if (val instanceof Stream) {
        
          handleStream.call(self, selector, 'update', val);
        
        } else {
        
          var action = actionFromVal(val);
          if (! action) {
            throw new Error('Value for selector `' + selector +
              '` should contain action field, either remove, replace or update');
          }
          var replaceBy = val[action];
          if (replaceBy instanceof Stream) {
            handleStream.call(self, selector, action, replaceBy);
          } else {
            self[action](selector, replaceBy);
          }
        }

        break;

      default:
        throw new Error('Invalid type of value ' + (typeof val) + ' for selector `' + selector + '`');

    }
  });
}

module.exports = map;