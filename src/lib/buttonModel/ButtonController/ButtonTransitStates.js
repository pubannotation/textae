import {
  EventEmitter as EventEmitter
}
from 'events'
import _ from 'underscore'

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

  return _.extend(eventEmitter, mixin)
}
