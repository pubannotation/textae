import Buttons from './Buttons'
import { MODE } from '../../../MODE'

export default class EnableState {
  constructor(eventEmitter, selectionModel, clipBoard) {
    // Enable always enabled buttons.
    this._states = new Map([
      ['import', true],
      ['upload', true],
      ['view mode', true],
      ['term edit mode', true],
      ['block edit mode', true],
      ['relation edit mode', true],
      ['simple view', true],
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
      .on('textae-event.selection.span.change', () => this._updateButtons())
      .on('textae-event.selection.relation.change', () => this._updateButtons())
      .on('textae-event.selection.entity.change', () => this._updateButtons())
      .on('textae-event.edit-mode.transition', (mode) => this._setForMode(mode))
      .on('textae-event.clip-board.change', () => this._updateByClipboard())
      .on('textae-event.annotation-auto-saver.enable', (enable) =>
        this.enable('upload automatically', enable)
      )
  }

  get(button) {
    return this._states.get(button)
  }

  enable(button, enable) {
    this._states.set(button, enable)
    this._propagate()
  }

  updateManipulateSpanButtons(enableToCreate, enableToExpand, enableToShrink) {
    this._states.set('create-span-by-touch', enableToCreate)
    this._states.set('expand-span-by-touch', enableToExpand)
    this._states.set('shrink-span-by-touch', enableToShrink)
    this._propagate()
  }

  _updateButtons() {
    for (const { type, enableWhenSelecting } of new Buttons()
      .enabelButtonsWhenSelecting) {
      this.enable(
        type,
        enableWhenSelecting(this._selectionModel, this._clipBoard)
      )
    }
    this._propagate()
  }

  _updateByClipboard() {
    this.enable(
      'paste',
      new Buttons().pasteButton.enableWhenSelecting(
        this._selectionModel,
        this._clipBoard
      )
    )
  }

  _propagate() {
    this._eventEmitter.emit(
      'textae-event.control.buttons.change',
      this._states.keys()
    )
  }

  _setForMode(mode) {
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
    this._propagate()
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
    this._states.set('simple view', simple)
    this._states.set('auto replicate', replicateAuto)
    this._states.set('boundary-detection', boundaryDetection)
    this._states.set('adjust lineheight', lineHeight)
    this._states.set('auto adjust lineheight', lineHeightAuto)
    this._states.set('create-span-by-touch', span)
    this._states.set('expand-span-by-touch', span)
    this._states.set('shrink-span-by-touch', span)
    this._states.set('pallet', pallet)
  }
}
