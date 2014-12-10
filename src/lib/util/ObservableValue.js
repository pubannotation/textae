var EventEmitter = require('events').EventEmitter;

module.exports = function(initial) {
  var value = initial,
    emitter = new EventEmitter(),
    get = function() {
      return value;
    },
    set = function(newValue) {
      if (value === newValue) return;

      value = newValue;
      emitter.emit('change', newValue);
    };

  return _.extend(emitter, {
    get: get,
    set: set
  });
};
