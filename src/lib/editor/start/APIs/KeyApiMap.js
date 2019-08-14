export default function(command, presenter, persistenceInterface) {
  return new Map([
    ['A', command.redo],
    ['B', presenter.event.toggleDetectBoundaryMode],
    ['C', presenter.event.copyEntities],
    ['D', presenter.event.removeSelectedElements],
    ['DEL', presenter.event.removeSelectedElements],
    ['E', presenter.event.createEntity],
    ['F', presenter.event.toggleInstaceRelation],
    ['I', () => persistenceInterface.importAnnotation()],
    ['M', presenter.event.toggleInstaceRelation],
    ['Q', presenter.event.showPallet],
    ['R', presenter.event.replicate],
    ['S', presenter.event.speculation],
    ['T', presenter.event.createAttribute],
    ['U', () => persistenceInterface.uploadAnnotation()],
    ['V', presenter.event.pasteEntities],
    ['W', presenter.event.changeLabel],
    ['X', presenter.event.negation],
    ['Y', command.redo],
    ['Z', command.undo],
    ['ESC', presenter.event.cancelSelect],
    ['LEFT', presenter.event.selectLeft],
    ['RIGHT', presenter.event.selectRight],
    ['UP', presenter.event.selectUp],
    ['DOWN', presenter.event.selectDown]
  ])
}
