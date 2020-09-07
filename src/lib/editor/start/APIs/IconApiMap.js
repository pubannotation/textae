export default function(
  commander,
  presenter,
  persistenceInterface,
  view,
  buttonController
) {
  const map = new Map([
    ['view', () => presenter.event.toViewMode()],
    ['term', () => presenter.event.toTermMode()],
    ['relation', () => presenter.event.toRelationMode()],
    ['simple', () => presenter.event.toggleSimpleMode()],
    ['read', () => persistenceInterface.importAnnotation()],
    ['write', () => persistenceInterface.uploadAnnotation()],
    ['undo', () => commander.undo()],
    ['redo', () => commander.redo()],
    ['replicate', () => presenter.event.replicate()],
    ['entity', () => presenter.event.createEntity()],
    ['change-label', () => presenter.event.changeLabel()],
    ['pallet', () => presenter.event.showPallet()],
    ['delete', () => presenter.event.removeSelectedElements()],
    ['copy', () => presenter.event.copyEntities()],
    ['cut', () => presenter.event.cutEntities()],
    ['paste', () => presenter.event.pasteEntities()],
    ['setting', () => presenter.event.showSettingDialog()],
    ['line-height', () => view.updateLineHeight()]
  ])

  // Set handler for push buttons.
  for (const buttonName of buttonController.pushButtonNames) {
    if (!map.has(buttonName)) {
      map.set(buttonName, () => presenter.event.toggleButton(buttonName))
    }
  }

  return map
}
