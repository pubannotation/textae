export default class IconEventMap extends Map {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    view,
    buttonController
  ) {
    super([
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
      ['create-span', () => presenter.createSpan()],
      ['expand-span', () => presenter.expandSpan()],
      ['shrink-span', () => presenter.shrinkSpan()],
      ['entity', () => presenter.createEntity()],
      ['change-label', () => presenter.editTypeValues()],
      ['pallet', () => presenter.showPallet()],
      ['delete', () => presenter.removeSelectedElements()],
      ['copy', () => presenter.copyEntities()],
      ['cut', () => presenter.cutEntities()],
      ['paste', () => presenter.pasteEntities()],
      ['setting', () => presenter.showSettingDialog()],
      ['line-height', () => view.updateLineHeight()]
    ])

    // Set handler for push buttons.
    for (const buttonName of buttonController.pushButtonNames) {
      if (!super.has(buttonName)) {
        super.set(buttonName, () => presenter.toggleButton(buttonName))
      }
    }
  }
}
