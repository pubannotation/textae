// Button state is true when the button is pushed.
export default class Button {
  constructor(editor, buttonName) {
    this._editor = editor
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

    return null
  }

  toggle() {
    this.state = !this.state
    this.propagate()
  }

  // Propagate button state to the tool.
  propagate() {
    this._editor.eventEmitter.emit('textae-event.control.button.push', {
      buttonName: this.name,
      state: this.state
    })
  }
}
