export default class {
  constructor(editor) {
    this._editor = editor
    this._states = {}
  }

  set(button, isTransit) {
    this._states[button] = isTransit
  }

  propagate() {
    this._editor.eventEmitter.emit(
      'textae.control.buttons.transit',
      this._states
    )
  }
}
