export default function(command, presenter, persistenceInterface) {
  return new Map([
    ['a', command.redo],
    ['b', presenter.event.toggleDetectBoundaryMode],
    ['c', presenter.event.copyEntities],
    ['d', presenter.event.removeSelectedElements],
    ['e', presenter.event.createEntity],
    ['f', presenter.event.toggleInstaceRelation],
    ['i', () => persistenceInterface.importAnnotation()],
    ['m', presenter.event.toggleInstaceRelation],
    ['q', presenter.event.showPallet],
    ['r', presenter.event.replicate],
    ['s', presenter.event.speculation],
    ['t', presenter.event.createAttribute],
    ['u', () => persistenceInterface.uploadAnnotation()],
    ['v', presenter.event.pasteEntities],
    ['w', presenter.event.changeLabel],
    ['x', presenter.event.negation],
    ['y', command.redo],
    ['z', command.undo],
    ['ArrowDown', presenter.event.selectDown],
    ['ArrowLeft', presenter.event.selectLeft],
    ['ArrowRight', presenter.event.selectRight],
    ['ArrowUp', presenter.event.selectUp],
    ['Backspace', presenter.event.removeSelectedElements],
    ['Delete', presenter.event.removeSelectedElements],
    ['Escape', presenter.event.cancelSelect]
  ])
}
