export default function(
  commander,
  presenter,
  persistenceInterface,
  buttonController,
  updateLineHeight
) {
  return new Map([
    ['view', () => presenter.event.toViewMode()],
    ['term', () => presenter.event.toTermMode()],
    ['relation', () => presenter.event.toRelationMode()],
    ['simple', () => presenter.event.toggleSimpleMode()],
    ['read', () => persistenceInterface.importAnnotation()],
    ['write', () => persistenceInterface.uploadAnnotation()],
    ['undo', commander.undo],
    ['redo', commander.redo],
    ['replicate', () => presenter.event.replicate()],
    [
      'replicate-auto',
      () => buttonController.pushButtons.getButton('replicate-auto').toggle()
    ],
    ['boundary-detection', () => presenter.event.toggleDetectBoundaryMode()],
    ['entity', () => presenter.event.createEntity()],
    ['change-label', () => presenter.event.changeLabel()],
    ['pallet', () => presenter.event.showPallet()],
    ['negation', () => presenter.event.negation()],
    ['speculation', () => presenter.event.speculation()],
    ['attribute', () => presenter.event.createAttribute()],
    ['delete', () => presenter.event.removeSelectedElements()],
    ['copy', () => presenter.event.copyEntities()],
    ['paste', () => presenter.event.pasteEntities()],
    ['setting', () => presenter.event.showSettingDialog()],
    ['line-height', updateLineHeight]
  ])
}
