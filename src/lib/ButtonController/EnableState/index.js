import buttonConfig from '../../buttonConfig'
import { MODE } from '../../MODE'
import bindEvents from './bindEvents'

export default class EnableState {
  constructor(editor, selectionModel, clipBoard) {
    // Save enable/disable state of contorol buttons.
    this._states = {}
    this._editor = editor
    this._selectionModel = selectionModel
    this._clipBoard = clipBoard

    // Enable always enabled buttons.
    this.enable('view', true)
    this.enable('term', true)
    this.enable('block', true)
    this.enable('relation', true)
    this.enable('simple', true)
    this.enable('setting', true)

    bindEvents(editor, this)
  }

  propagate() {
    this._editor.eventEmitter.emit(
      'textae-event.control.buttons.change',
      this._states
    )
  }

  enable(button, enable) {
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
      this.enable(name, enabled)
    }
  }

  updateByClipboard() {
    this.enable('paste', this._enablePaste)
  }

  get _enablePaste() {
    return buttonConfig.spanButtons
      .find(({ name }) => name === 'copy')
      .predicate(this._selectionModel, this._clipBoard)
  }

  setForMode(mode) {
    switch (mode) {
      case MODE.VIEW_WITHOUT_RELATION:
      case MODE.VIEW_WITH_RELATION:
        this._updateButtonsForMode(true, false, false, false, false, false)
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._updateButtonsForMode(true, true, true, true, true, true)
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this._updateButtonsForMode(true, false, true, true, true, true)
        break
      case MODE.EDIT_RELATION:
        this._updateButtonsForMode(false, false, false, true, true, true)
        break
      default:
        throw `unknown edit mode!${mode}`
    }
    this.propagate()
  }

  _updateButtonsForMode(
    simple,
    replicateAuto,
    boundaryDetection,
    lineHeight,
    lineHeightAuto,
    pallet
  ) {
    this._states['simple'] = simple
    this._states['replicate-auto'] = replicateAuto
    this._states['boundary-detection'] = boundaryDetection
    this._states['line-height'] = lineHeight
    this._states['line-height-auto'] = lineHeightAuto
    this._states['pallet'] = pallet
  }
}
