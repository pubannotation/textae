import isRelation from '../isRelation'
import isSpanEdit from '../isSpanEdit'
import isView from '../isView'
import ButtonEnableStates from './ButtonEnableStates'

export default class {
  constructor(editor, pushButtons, selectionModel, clipBoard) {
    // Save enable/disable state of contorol buttons.
    const buttonEnableStates = new ButtonEnableStates(
      editor,
      selectionModel,
      clipBoard
    )

    this._buttonEnableStates = buttonEnableStates
    this._propagate = () => {
      buttonEnableStates.propagate()
      pushButtons.propagate()
    }

    // Enable always enabled buttons.
    this.enabled('view', true)
    this.enabled('term', true)
    this.enabled('relation', true)
    this.enabled('simple', true)
    this.enabled('setting', true)

    // Bind events.
    editor.eventEmitter
      .on('textae.history.change', (history) => {
        // change button state
        this.enabled('undo', history.hasAnythingToUndo)
        this.enabled('redo', history.hasAnythingToRedo)
      })
      .on('textae.selection.span.change', () => this.updateBySpan())
      .on('textae.selection.relation.change', () => this.updateByRelation())
      .on('textae.viewMode.entity.selectChange', () => {
        // The buttons to edit entities are only enabled when in Entity edit mode.
        // We want to monitor entity selection events only when in Entity edit mode.
        // Entity selection events are monitored via the ViewModel instead of directly monitoring the SelectionModel.
        this.updateByEntity()
      })
      .on('textae.editMode.transition', (editable, mode) => {
        this.enabled('simple', !isRelation(mode))
        this.enabled('replicate-auto', isSpanEdit(editable, mode))
        this.enabled('boundary-detection', isSpanEdit(editable, mode))
        this.enabled('line-height', editable)
        this.enabled('pallet', !isView(editable))
      })
  }

  propagate() {
    this._propagate()
  }

  enabled(button, enable) {
    this._buttonEnableStates.set(button, enable)
    this._propagate()
  }

  updateBySpan() {
    this._buttonEnableStates.updateSpanButtons()
    this._propagate()
  }

  updateByEntity() {
    this._buttonEnableStates.updateEntityButtons()
    this._propagate()
  }

  updateByRelation() {
    this._buttonEnableStates.updateRelationButtons()
    this._propagate()
  }
}
