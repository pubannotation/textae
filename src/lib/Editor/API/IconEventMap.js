export default class IconEventMap {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    controlViewModel,
    annotationData
  ) {
    this._map = new Map([
      ['view mode', () => presenter.toViewMode()],
      ['term edit mode', () => presenter.toTermMode()],
      ['block edit mode', () => presenter.toBlockMode()],
      ['relation edit mode', () => presenter.toRelationMode()],
      ['simple view', () => presenter.toggleSimpleMode()],
      ['import', () => persistenceInterface.importAnnotation()],
      ['upload', () => persistenceInterface.uploadAnnotation()],
      ['undo', () => commander.undo()],
      ['redo', () => commander.redo()],
      ['replicate span annotation', () => presenter.replicate()],
      ['create-span-by-touch', () => presenter.createSpan()],
      ['expand-span-by-touch', () => presenter.expandSpan()],
      ['shrink-span-by-touch', () => presenter.shrinkSpan()],
      ['create-entity', () => presenter.createEntity()],
      ['edit-properties', () => presenter.editProperties()],
      ['pallet', () => presenter.showPallet()],
      ['delete', () => presenter.removeSelectedElements()],
      ['copy', () => presenter.copyEntitiesToLocalClipboard()],
      ['cut', () => presenter.cutEntitiesToLocalClipboard()],
      ['paste', () => presenter.pasteEntitiesFromLocalClipboard()],
      ['setting', () => presenter.showSettingDialog()],
      ['adjust lineheight', () => annotationData.textBox.updateLineHeight()]
    ])

    // Set handler for push buttons.
    for (const buttonName of controlViewModel.pushButtonNames) {
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
