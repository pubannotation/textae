// Button state is true when the button is pushed.
export default class Button {
  constructor(eventEmitter, buttonName) {
    this._eventEmitter = eventEmitter
    this._name = buttonName
    this._state = false
  }

  get value() {
    return this._state
  }

  set value(value) {
    this._state = value
    this.propagate()
  }

  toggle() {
    this._state = !this._state
    this.propagate()
  }

  // Propagate button state to the tool.
  propagate() {
    this._eventEmitter.emit('textae-event.control.button.push', {
      buttonName: this._name,
      state: this._state
    })
  }
}
