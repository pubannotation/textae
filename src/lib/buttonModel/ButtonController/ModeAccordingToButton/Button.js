import {EventEmitter as EventEmitter} from 'events'

export default function(buttonName) {
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
