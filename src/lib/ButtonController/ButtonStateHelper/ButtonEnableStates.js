import buttonConfig from '../../buttonConfig'

export default class {
  constructor(editor, selectionModel, clipBoard) {
    this._states = {}
    this._editor = editor
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

  updateSpanButtons() {
    this._updateButtons(buttonConfig.spanButtons)
  }

  updateEntityButtons() {
    this._updateButtons(buttonConfig.entityButtons)
  }

  updateRelationButtons() {
    this._updateButtons(buttonConfig.relationButtons)
  }

  _updateButtons(buttons) {
    for (const { name, predicate } of buttons) {
      const enabled = predicate(this._selectionModel, this._clipBoard)
      this.set(name, enabled)
    }
  }
}
