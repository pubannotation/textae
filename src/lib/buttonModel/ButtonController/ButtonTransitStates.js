import { EventEmitter } from 'events'

export default function() {
  const states = {}
  const eventEmitter = new EventEmitter()
  const mixin = {
    set(button, isTransit) {
      states[button] = isTransit
    },
    propagate() {
      eventEmitter.emit('change', states)
    }
  }

  return Object.assign(eventEmitter, mixin)
}
