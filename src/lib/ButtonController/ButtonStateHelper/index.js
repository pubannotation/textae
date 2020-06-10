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
    this._selectionModel = selectionModel
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
