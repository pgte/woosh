var Stream = require('stream').Stream;

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
      throw new Error('Ambiguous action, don\'t know what to do with it');
    }
  }
  return remainingActions[0];
}

function map(mapping) {
  var self = this;
  
  if (typeof mapping !== 'object') {
    throw new Error('Map argument should be object literal');
  }

  Object.keys(mapping).forEach(function(selector) {
    var val = mapping[selector];

    // console.log('val:', val);

    switch (typeof val) {
      
      case 'string':
      case 'function':

        console.log('A');

        console.log('.update(%j, %s)', selector, val);

        self.update(selector, val);

        break;

      case 'object':

        console.log('B');

        var action = actionFromVal(val);
        if (! action) {
          throw new Error('Value for selector `' + selector + '` should contain action field, either rmeove, replace or update');
        }

        console.log('.%s(%j, %j)', action, selector, val[action]);

        self[action](selector, val[action]);

        break;

      default:
        throw new Error('Invalid type of value ' + (typeof val) + ' for selector `' + selector + '`');

    }
  });
}

module.exports = map;