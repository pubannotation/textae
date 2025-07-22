export default class IconEventMap {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    menuState,
    annotationModel,
    editMode
  ) {
    this._map = new Map([
      ['view mode', () => presenter.toViewMode()],
      ['term edit mode', () => presenter.toTermEditMode()],
      ['block edit mode', () => presenter.toBlockEditMode()],
      ['relation edit mode', () => presenter.toRelationEditMode()],
      ['text edit mode', () => presenter.toTextEditMode()],
      ['simple view', () => presenter.toggleSimpleMode()],
      ['import', () => persistenceInterface.importAnnotation()],
      ['upload', () => persistenceInterface.uploadAnnotation()],
      ['undo', () => commander.undo()],
      ['redo', () => commander.redo()],
      ['replicate span annotation', () => presenter.replicate()],
      [
        'create span by touch',
        () => editMode.current.createSpanWithTouchDevice()
      ],
      [
        'expand span by touch',
        () => editMode.current.expandSpanWithTouchDevice()
      ],
      [
        'shrink span by touch',
        () => editMode.current.shrinkSpanWithTouchDevice()
      ],
      ['edit text by touch', () => editMode.current.editTextWithTouchDevice()],
      ['new entity', () => presenter.createEntity()],
      ['edit properties', () => editMode.current.editProperties()],
      ['pallet', () => presenter.showPallet()],
      ['delete', () => presenter.removeSelectedElements()],
      ['copy', () => presenter.copyEntitiesToLocalClipboard()],
      ['cut', () => presenter.cutEntitiesToLocalClipboard()],
      ['paste', () => presenter.pasteEntitiesFromLocalClipboard()],
      ['setting', () => presenter.showSettingDialog()],
      ['adjust lineheight', () => annotationModel.textBox.updateLineHeight()]
    ])

    // Set handler for push buttons.
    for (const buttonName of menuState.pushButtonNames) {
      if (!this._map.has(buttonName)) {
        this._map.set(buttonName, () => presenter.toggleButton(buttonName))
      }
    }
  }

  handle(key) {
    if (this._map.has(key)) {
      this._map.get(key)()
    }
  }
}
