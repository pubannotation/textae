// Button state is true when the button is pushed.
export default class Button {
  constructor(buttonName, eventEmitter = null) {
    this._name = buttonName
    this._eventEmitter = eventEmitter
    this._state = false
  }

  get pushed() {
    return this._state
  }

  set pushed(value) {
    this._state = value
    this.propagate()
  }

  toggle() {
    this._state = !this._state
    this.propagate()
  }

  // Propagate button state to the tool.
  propagate() {
    if (this._eventEmitter) {
      this._eventEmitter.emit('textae-event.control.button.push', {
        buttonName: this._name,
        state: this._state
      })
    }
  }
}
