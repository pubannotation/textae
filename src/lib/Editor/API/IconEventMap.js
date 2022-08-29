export default class IconEventMap {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    buttonController,
    annotationData
  ) {
    this._map = new Map([
      ['view', () => presenter.toViewMode()],
      ['term', () => presenter.toTermMode()],
      ['block', () => presenter.toBlockMode()],
      ['relation', () => presenter.toRelationMode()],
      ['simple', () => presenter.toggleSimpleMode()],
      ['read', () => persistenceInterface.importAnnotation()],
      ['write', () => persistenceInterface.uploadAnnotation()],
      ['undo', () => commander.undo()],
      ['redo', () => commander.redo()],
      ['replicate', () => presenter.replicate()],
      ['create-span-by-touch', () => presenter.createSpan()],
      ['expand-span-by-touch', () => presenter.expandSpan()],
      ['shrink-span-by-touch', () => presenter.shrinkSpan()],
      ['entity', () => presenter.createEntity()],
      ['edit-properties', () => presenter.editProperties()],
      ['pallet', () => presenter.showPallet()],
      ['delete', () => presenter.removeSelectedElements()],
      ['copy', () => presenter.copyEntitiesToLocalClipboard()],
      ['cut', () => presenter.cutEntitiesToLocalClipboard()],
      ['paste', () => presenter.pasteEntitiesFromLocalClipboard()],
      ['setting', () => presenter.showSettingDialog()],
      ['line-height', () => annotationData.textBox.updateLineHeight()]
    ])

    // Set handler for push buttons.
    for (const buttonName of buttonController.pushButtonNames) {
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
