export default class IconEventMap {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    menuState,
    annotationModel,
    currentEditMode,
    editModeSwitch
  ) {
    this._map = new Map([
      ['view mode', () => editModeSwitch.toViewMode()],
      ['term edit mode', () => editModeSwitch.toTermEditMode()],
      ['block edit mode', () => editModeSwitch.toBlockEditMode()],
      ['relation edit mode', () => editModeSwitch.toRelationEditMode()],
      ['text edit mode', () => editModeSwitch.toTextEditMode()],
      ['simple view', () => editModeSwitch.toggleSimpleMode()],
      ['import', () => persistenceInterface.importAnnotation()],
      ['upload', () => persistenceInterface.uploadAnnotation()],
      ['undo', () => commander.undo()],
      ['redo', () => commander.redo()],
      ['replicate span annotation', () => presenter.replicate()],
      [
        'create span by touch',
        () => currentEditMode.current.createSpanWithTouchDevice()
      ],
      [
        'expand span by touch',
        () => currentEditMode.current.expandSpanWithTouchDevice()
      ],
      [
        'shrink span by touch',
        () => currentEditMode.current.shrinkSpanWithTouchDevice()
      ],
      [
        'edit text by touch',
        () => currentEditMode.current.editTextWithTouchDevice()
      ],
      ['new entity', () => presenter.createEntity()],
      ['edit properties', () => currentEditMode.current.editProperties()],
      ['pallet', () => currentEditMode.current.showPallet()],
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
