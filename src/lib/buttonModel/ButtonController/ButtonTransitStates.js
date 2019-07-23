import {
  EventEmitter as EventEmitter
}
from 'events'

export default function() {
  const states = {},
    eventEmitter = new EventEmitter(),
    mixin = {
      set(button, isTransit) {
        states[button] = isTransit
      },
      propagate() {
        eventEmitter.emit('change', states)
      }
    }

  return Object.assign(eventEmitter, mixin)
}
