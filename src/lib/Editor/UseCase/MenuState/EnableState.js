import { MODE } from '../../../MODE'
import Buttons from './Buttons'

export default class EnableState {
  #states
  #eventEmitter
  #selectionModel
  #clipBoard

  constructor(eventEmitter, selectionModel, clipBoard) {
    // Enable always enabled buttons.
    this.#states = new Map([
      ['import', true],
      ['upload', true],
      ['view mode', true],
      ['term edit mode', true],
      ['block edit mode', true],
      ['relation edit mode', true],
      ['text edit mode', true],
      ['simple view', true],
      ['setting', true],
      ['help', true]
    ])

    this.#eventEmitter = eventEmitter
    this.#selectionModel = selectionModel
    this.#clipBoard = clipBoard

    eventEmitter
      .on('textae-event.history.change', (history) => {
        // change button state
        this.enable('undo', history.hasAnythingToUndo)
        this.enable('redo', history.hasAnythingToRedo)
      })
      .on('textae-event.selection.span.change', () => this.#updateButtons())
      .on('textae-event.selection.relation.change', () => this.#updateButtons())
      .on('textae-event.selection.entity.change', () => this.#updateButtons())
      .on('textae-event.edit-mode.transition', (mode) => this.#setForMode(mode))
      .on('textae-event.clip-board.change', () => this.#updateByClipboard())
      .on('textae-event.annotation-auto-saver.enable', (enable) =>
        this.enable('upload automatically', enable)
      )
  }

  get(button) {
    return this.#states.get(button)
  }

  enable(button, enable) {
    this.#states.set(button, enable)
    this.#propagate()
  }

  updateButtonsToOperateSpanWithTouchDevice(
    enableToCreate,
    enableToExpand,
    enableToShrink,
    enableToEditText
  ) {
    this.#states.set('create span by touch', enableToCreate)
    this.#states.set('expand span by touch', enableToExpand)
    this.#states.set('shrink span by touch', enableToShrink)
    this.#states.set('edit text by touch', enableToEditText)
    this.#propagate()
  }

  #updateButtons() {
    for (const { type, enableWhenSelecting } of new Buttons()
      .enableButtonsWhenSelecting) {
      this.enable(
        type,
        enableWhenSelecting(this.#selectionModel, this.#clipBoard)
      )
    }
    this.#propagate()
  }

  #updateByClipboard() {
    this.enable(
      'paste',
      new Buttons().pasteButton.enableWhenSelecting(
        this.#selectionModel,
        this.#clipBoard
      )
    )
  }

  #propagate() {
    this.#eventEmitter.emit(
      'textae-event.control.buttons.change',
      this.#states.keys()
    )
  }

  #setForMode(mode) {
    switch (mode) {
      case MODE.VIEW:
        this.#updateButtonsForMode(
          true,
          false,
          false,
          false,
          false,
          false,
          false
        )
        break
      case MODE.EDIT_DENOTATION:
        this.#updateButtonsForMode(true, true, true, true, true, true, true)
        break
      case MODE.EDIT_BLOCK:
        this.#updateButtonsForMode(true, false, true, true, true, true, true)
        break
      case MODE.EDIT_RELATION:
        this.#updateButtonsForMode(false, false, false, true, true, false, true)
        break
      case MODE.EDIT_TEXT:
        this.#updateButtonsForMode(true, false, true, true, true, false, false)
        break
      default:
        throw `unknown edit mode!${mode}`
    }
    this.#propagate()
  }

  /**
   *
   * @param {boolean} simple
   * @param {boolean} replicateAuto
   * @param {boolean} boundaryDetection
   * @param {boolean} lineHeight
   * @param {boolean} lineHeightAuto
   * @param {boolean} span
   * @param {boolean} pallet
   */
  #updateButtonsForMode(
    simple,
    replicateAuto,
    boundaryDetection,
    lineHeight,
    lineHeightAuto,
    span,
    pallet
  ) {
    this.#states.set('simple view', simple)
    this.#states.set('auto replicate', replicateAuto)
    this.#states.set('boundary detection', boundaryDetection)
    this.#states.set('adjust lineheight', lineHeight)
    this.#states.set('auto adjust lineheight', lineHeightAuto)
    this.#states.set('create span by touch', span)
    this.#states.set('expand span by touch', span)
    this.#states.set('shrink span by touch', span)
    this.#states.set('pallet', pallet)
  }
}
