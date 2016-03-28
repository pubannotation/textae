import {
  EventEmitter as EventEmitter
}
from 'events'

export default function() {
  const states = {},
    eventEmitter = new EventEmitter(),
    mixin = {
      set(button, enable) {
        states[button] = enable
      },
      propagate() {
        eventEmitter.emit('change', states)
      }
    }

  return _.extend(eventEmitter, mixin)
}
