export default function(commander, presenter, persistenceInterface) {
  return new Map([
    ['a', commander.redo],
    ['b', () => presenter.event.toggleDetectBoundaryMode()],
    ['c', () => presenter.event.copyEntities()],
    ['d', () => presenter.event.removeSelectedElements()],
    ['e', () => presenter.event.createEntity()],
    ['f', () => presenter.event.toggleInstaceRelation()],
    ['i', () => persistenceInterface.importAnnotation()],
    ['m', () => presenter.event.toggleInstaceRelation()],
    ['q', (option) => presenter.event.showPallet(option)],
    ['r', () => presenter.event.replicate()],
    ['s', () => presenter.event.speculation()],
    ['t', () => presenter.event.createAttribute()],
    ['u', () => persistenceInterface.uploadAnnotation()],
    ['v', () => presenter.event.pasteEntities()],
    ['w', () => presenter.event.changeLabel()],
    ['x', () => presenter.event.negation()],
    ['y', commander.redo],
    ['z', commander.undo],
    ['ArrowDown', () => presenter.event.selectDown()],
    ['ArrowLeft', (option) => presenter.event.selectLeft(option)],
    ['ArrowRight', (option) => presenter.event.selectRight(option)],
    ['ArrowUp', () => presenter.event.selectUp()],
    ['Backspace', () => presenter.event.removeSelectedElements()],
    ['Delete', () => presenter.event.removeSelectedElements()],
    ['Escape', () => presenter.event.cancelSelect()]
  ])
}
