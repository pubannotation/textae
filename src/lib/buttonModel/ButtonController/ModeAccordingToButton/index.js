import {
  EventEmitter as EventEmitter
}
from 'events'
import reduce2hash from '../reduce2hash'
import Button from './Button'
import propagateStateOf from './propagateStateOf'

const buttonList = [
  'view',
  'term',
  'relation',
  'simple',
  'boundary-detection',
  'negation',
  'replicate-auto',
  'speculation'
]

export default class extends EventEmitter {
  constructor() {
    super()
    this.buttons = buttonList.map((name) => new Button(name))
    this.buttonHash = this.buttons.reduce(reduce2hash(), {})

    // default pushed;
    this.buttonHash['boundary-detection'].value(true)

    // Bind events.
    this.buttons.forEach(function(button) {
      button.on('change', (data) => super.emit('change', data))
    })
  }

  propagate() {
    propagateStateOf(this, this.buttons)
  }

  getButton(name) {
    return this.buttonHash[name]
  }
}
