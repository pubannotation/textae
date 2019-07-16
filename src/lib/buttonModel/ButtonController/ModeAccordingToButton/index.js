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

export default function() {
  const emitter = new EventEmitter()
  const buttons = buttonList.map((name) => new Button(name))
  const propagateStateOfAllButtons = () => propagateStateOf(emitter, buttons)
  const buttonHash = buttons.reduce(reduce2hash(), {})

  // default pushed;
  buttonHash['boundary-detection'].value(true)

  // Bind events.
  buttons.forEach(function(button) {
    button.on('change', (data) => emitter.emit('change', data))
  })

  return Object.assign(
    emitter,
    buttonHash, {
      propagate: propagateStateOfAllButtons
    }
  )
}
