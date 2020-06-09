import buttonConfig from '../buttonConfig'

export default class {
  constructor(editor, selectionModel, clipBoard) {
    this._editor = editor
    this._states = {}
    this._selectionModel = selectionModel
    this._clipBoard = clipBoard
  }

  set(button, enable) {
    this._states[button] = enable
  }

  propagate() {
    this._editor.eventEmitter.emit(
      'textae.control.buttons.change',
      this._states
    )
  }

  updateButtons(buttons) {
    for (const buttonName of buttons) {
      const enabled = buttonConfig.isEnable(
        buttonName,
        this._selectionModel,
        this._clipBoard
      )

      this.set(buttonName, enabled)
    }
  }
}
