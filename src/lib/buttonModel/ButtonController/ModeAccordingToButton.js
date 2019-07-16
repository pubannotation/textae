import {
  EventEmitter as EventEmitter
}
from 'events'
import reduce2hash from './reduce2hash'

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
  const buttons = buttonList.map(Button)
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

function Button(buttonName) {
  // Button state is true when the button is pushed.
  const emitter = new EventEmitter()

  let state = false

  const value = (newValue) => {
    if (newValue !== undefined) {
      state = newValue
      propagate()
    } else {
      return state
    }
  }

  const toggle = function toggleButton() {
    state = !state
    propagate()
  }

  // Propagate button state to the tool.
  const propagate = () => emitter.emit('change', {
    buttonName: buttonName,
    state: state
  })

  return Object.assign(emitter, {
    name: buttonName,
    value: value,
    toggle: toggle,
    propagate: propagate
  })
}

function propagateStateOf(emitter, buttons) {
  buttons
    .map(toData)
    .forEach((data) => emitter.emit('change', data))
}

function toData(button) {
  return {
    buttonName: button.name,
    state: button.value()
  }
}
