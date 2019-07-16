import {
  EventEmitter as EventEmitter
}
from 'events'

export default class extends EventEmitter {
  constructor() {
    super()
    this.states = {}
  }

  set(button, enable) {
    this.states[button] = enable
  }

  propagate() {
    super.emit('change', this.states)
  }
}
