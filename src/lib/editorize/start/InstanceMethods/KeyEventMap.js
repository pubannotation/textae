export default class KeyEventMap extends Map {
  constructor(commander, presenter, persistenceInterface) {
    super([
      ['1', (shiftKey) => presenter.manipulateAttribute(1, shiftKey)],
      ['2', (shiftKey) => presenter.manipulateAttribute(2, shiftKey)],
      ['3', (shiftKey) => presenter.manipulateAttribute(3, shiftKey)],
      ['4', (shiftKey) => presenter.manipulateAttribute(4, shiftKey)],
      ['5', (shiftKey) => presenter.manipulateAttribute(5, shiftKey)],
      ['6', (shiftKey) => presenter.manipulateAttribute(6, shiftKey)],
      ['7', (shiftKey) => presenter.manipulateAttribute(7, shiftKey)],
      ['8', (shiftKey) => presenter.manipulateAttribute(8, shiftKey)],
      ['9', (shiftKey) => presenter.manipulateAttribute(9, shiftKey)],
      ['a', () => commander.redo()],
      ['b', () => presenter.toggleButton('boundary-detection')],
      ['c', () => presenter.copyEntities()],
      ['d', () => presenter.removeSelectedElements()],
      ['e', () => presenter.createEntity()],
      ['f', () => presenter.changeModeByShortcut()],
      ['i', () => persistenceInterface.importAnnotation()],
      ['m', () => presenter.changeModeByShortcut()],
      ['q', () => presenter.showPallet()],
      ['r', () => presenter.replicate()],
      ['u', () => persistenceInterface.uploadAnnotation()],
      ['v', () => presenter.pasteEntities()],
      ['w', () => presenter.editTypeValues()],
      ['x', () => presenter.cutEntities()],
      ['y', () => commander.redo()],
      ['z', () => commander.undo()],
      ['ArrowDown', () => presenter.selectDown()],
      ['ArrowLeft', (shiftKey) => presenter.selectLeft(shiftKey)],
      ['ArrowRight', (shiftKey) => presenter.selectRight(shiftKey)],
      ['ArrowUp', () => presenter.selectUp()],
      ['Backspace', () => presenter.removeSelectedElements()],
      ['Delete', () => presenter.removeSelectedElements()],
      ['Escape', () => presenter.cancelSelect()]
    ])
  }
}
