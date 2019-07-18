import {EventEmitter as EventEmitter} from 'events'

// Button state is true when the button is pushed.
export default class extends EventEmitter {
  constructor(buttonName) {
    super()
    this.name = buttonName
    this.state = false
  }

  value(newValue) {
    if (newValue !== undefined) {
      this.state = newValue
      this.propagate()
    } else {
      return this.state
    }
  }

  toggle() {
    this.state = !this.state
    this.propagate()
  }

  // Propagate button state to the tool.
  propagate() {
    super.emit('change', {
      buttonName: this.name,
      state: this.state
    })
  }
}
