import buttonConfig from '../../buttonConfig'
import bindEvents from './bindEvents'

export default class {
  constructor(editor, selectionModel, clipBoard) {
    // Save enable/disable state of contorol buttons.
    this._states = {}
    this._editor = editor
    this._selectionModel = selectionModel
    this._clipBoard = clipBoard

    // Enable always enabled buttons.
    this.enabled('view', true)
    this.enabled('term', true)
    this.enabled('relation', true)
    this.enabled('simple', true)
    this.enabled('setting', true)

    bindEvents(editor, this)
  }

  propagate() {
    this._editor.eventEmitter.emit(
      'textae.control.buttons.change',
      this._states
    )
  }

  enabled(button, enable) {
    this._states[button] = enable
    this.propagate()
  }

  updateBySpan() {
    this._updateButtons(buttonConfig.spanButtons)
    this.propagate()
  }

  updateByEntity() {
    this._updateButtons(buttonConfig.entityButtons)
    this.propagate()
  }

  updateByRelation() {
    this._updateButtons(buttonConfig.relationButtons)
    this.propagate()
  }

  _updateButtons(buttons) {
    for (const { name, predicate } of buttons) {
      const enabled = predicate(this._selectionModel, this._clipBoard)
      this.enabled(name, enabled)
    }
  }

  get _enablePaste() {
    return buttonConfig.spanButtons
      .find(({ name }) => name === 'copy')
      .predicate(this._selectionModel, this._clipBoard)
  }
}
