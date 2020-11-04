export default function (commander, presenter, persistenceInterface) {
  return new Map([
    ['1', (shiftKey) => presenter.event.manipulateAttribute(1, shiftKey)],
    ['2', (shiftKey) => presenter.event.manipulateAttribute(2, shiftKey)],
    ['3', (shiftKey) => presenter.event.manipulateAttribute(3, shiftKey)],
    ['4', (shiftKey) => presenter.event.manipulateAttribute(4, shiftKey)],
    ['5', (shiftKey) => presenter.event.manipulateAttribute(5, shiftKey)],
    ['6', (shiftKey) => presenter.event.manipulateAttribute(6, shiftKey)],
    ['7', (shiftKey) => presenter.event.manipulateAttribute(7, shiftKey)],
    ['8', (shiftKey) => presenter.event.manipulateAttribute(8, shiftKey)],
    ['9', (shiftKey) => presenter.event.manipulateAttribute(9, shiftKey)],
    ['a', commander.redo],
    ['b', () => presenter.event.toggleButton('boundary-detection')],
    ['c', () => presenter.event.copyEntities()],
    ['d', () => presenter.event.removeSelectedElements()],
    ['e', () => presenter.event.createEntity()],
    ['f', () => presenter.event.changeMode()],
    ['i', () => persistenceInterface.importAnnotation()],
    ['m', () => presenter.event.changeMode()],
    ['q', () => presenter.event.showPallet()],
    ['r', () => presenter.event.replicate()],
    ['u', () => persistenceInterface.uploadAnnotation()],
    ['v', () => presenter.event.pasteEntities()],
    ['w', () => presenter.event.changeLabel()],
    ['x', () => presenter.event.cutEntities()],
    ['y', () => commander.redo()],
    ['z', () => commander.undo()],
    ['ArrowDown', () => presenter.event.selectDown()],
    ['ArrowLeft', (shiftKey) => presenter.event.selectLeft(shiftKey)],
    ['ArrowRight', (shiftKey) => presenter.event.selectRight(shiftKey)],
    ['ArrowUp', () => presenter.event.selectUp()],
    ['Backspace', () => presenter.event.removeSelectedElements()],
    ['Delete', () => presenter.event.removeSelectedElements()],
    ['Escape', () => presenter.event.cancelSelect()]
  ])
}
