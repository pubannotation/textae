import buttonConfig from '../../buttonConfig'
import { MODE } from '../../../MODE'

export default class EnableState {
  constructor(eventEmitter, selectionModel, clipBoard) {
    // Enable always enabled buttons.
    this._states = new Map([
      ['read', true],
      ['write', true],
      ['view', true],
      ['term', true],
      ['block', true],
      ['relation', true],
      ['simple', true],
      ['setting', true],
      ['help', true]
    ])

    this._eventEmitter = eventEmitter
    this._selectionModel = selectionModel
    this._clipBoard = clipBoard

    eventEmitter
      .on('textae-event.history.change', (history) => {
        // change button state
        this.enable('undo', history.hasAnythingToUndo)
        this.enable('redo', history.hasAnythingToRedo)
      })
      .on('textae-event.selection.span.change', () => this.updateBySpan())
      .on('textae-event.selection.relation.change', () =>
        this.updateByRelation()
      )
      .on('textae-event.selection.entity.change', () => this.updateByEntity())
      .on('textae-event.edit-mode.transition', (mode) => this.setForMode(mode))
      .on('textae-event.clip-board.change', () => this.updateByClipboard)
      .on('textae-event.annotation-auto-saver.enable', (enable) =>
        this.enable('write-auto', enable)
      )
  }

  get(button) {
    return this._states.get(button)
  }

  propagate() {
    this._eventEmitter.emit('textae-event.control.buttons.change', this._states)
  }

  enable(button, enable) {
    this._states.set(button, enable)
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
        this._updateButtonsForMode(
          true,
          false,
          false,
          false,
          false,
          false,
          false
        )
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._updateButtonsForMode(true, true, true, true, true, true, true)
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this._updateButtonsForMode(true, false, true, true, true, true, true)
        break
      case MODE.EDIT_RELATION:
        this._updateButtonsForMode(false, false, false, true, true, false, true)
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
    span,
    pallet
  ) {
    this._states.set('simple', simple)
    this._states.set('replicate-auto', replicateAuto)
    this._states.set('boundary-detection', boundaryDetection)
    this._states.set('line-height', lineHeight)
    this._states.set('line-height-auto', lineHeightAuto)
    this._states.set('create-span', span)
    this._states.set('expand-span', span)
    this._states.set('shrink-span', span)
    this._states.set('pallet', pallet)
  }
}
