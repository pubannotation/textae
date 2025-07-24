export default class KeyEventMap {
  /**
   * @param {import('./Commander').default} commander
   * @param {import('./Presenter').default} presenter
   * @param {import('./PersistenceInterface').default} persistenceInterface
   * @param {import('./FunctionAvailability').default} functionAvailability
   */
  constructor(
    commander,
    presenter,
    persistenceInterface,
    functionAvailability,
    currentEditMode,
    editModeSwitch
  ) {
    this._map = new Map([
      ['1', (shiftKey) => currentEditMode.manipulateAttribute(1, shiftKey)],
      ['2', (shiftKey) => currentEditMode.manipulateAttribute(2, shiftKey)],
      ['3', (shiftKey) => currentEditMode.manipulateAttribute(3, shiftKey)],
      ['4', (shiftKey) => currentEditMode.manipulateAttribute(4, shiftKey)],
      ['5', (shiftKey) => currentEditMode.manipulateAttribute(5, shiftKey)],
      ['6', (shiftKey) => currentEditMode.manipulateAttribute(6, shiftKey)],
      ['7', (shiftKey) => currentEditMode.manipulateAttribute(7, shiftKey)],
      ['8', (shiftKey) => currentEditMode.manipulateAttribute(8, shiftKey)],
      ['9', (shiftKey) => currentEditMode.manipulateAttribute(9, shiftKey)],
      ['a', () => functionAvailability.isAvailable('redo') && commander.redo()],
      [
        'b',
        () =>
          functionAvailability.isAvailable('boundary detection') &&
          presenter.toggleButton('boundary detection')
      ],
      [
        'd',
        () =>
          functionAvailability.isAvailable('delete') &&
          presenter.removeSelectedElements()
      ],
      [
        'e',
        () =>
          functionAvailability.isAvailable('new entity') &&
          presenter.createEntity()
      ],
      ['f', () => editModeSwitch.changeModeByShortcut()],
      [
        'i',
        () =>
          functionAvailability.isAvailable('import') &&
          persistenceInterface.importAnnotation()
      ],
      ['m', () => editModeSwitch.changeModeByShortcut()],
      [
        'q',
        () =>
          functionAvailability.isAvailable('pallet') &&
          currentEditMode.showPallet()
      ],
      [
        'r',
        () =>
          functionAvailability.isAvailable('replicate span annotation') &&
          presenter.replicate()
      ],
      [
        'u',
        () =>
          functionAvailability.isAvailable('upload') &&
          persistenceInterface.uploadAnnotation()
      ],
      [
        'w',
        () =>
          functionAvailability.isAvailable('edit properties') &&
          currentEditMode.editProperties()
      ],
      ['y', () => functionAvailability.isAvailable('redo') && commander.redo()],
      ['z', () => functionAvailability.isAvailable('undo') && commander.undo()],
      ['ArrowDown', () => presenter.selectDown()],
      ['ArrowLeft', (shiftKey) => presenter.selectLeft(shiftKey)],
      ['ArrowRight', (shiftKey) => presenter.selectRight(shiftKey)],
      ['ArrowUp', () => presenter.selectUp()],
      ['Backspace', () => presenter.removeSelectedElements()],
      ['Delete', () => presenter.removeSelectedElements()],
      ['Escape', () => presenter.cancelSelect()]
    ])
  }

  handle(event) {
    // The value of the key property when pressing a key while holding down the Shift key depends on the keyboard layout.
    // For example, on a US keyboard, the shift + 1 keystroke is “!”.
    // When shift and number key are pressed, the input value is taken from the keyCode property.
    const key =
      event.shiftKey && 48 <= event.keyCode && event.keyCode <= 57
        ? String.fromCharCode(event.keyCode)
        : event.key

    if (this._map.has(key)) {
      this._map.get(key)(event.shiftKey)
    }
  }
}
