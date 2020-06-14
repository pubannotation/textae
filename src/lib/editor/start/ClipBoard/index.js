import getTypesOfSelectedEntities from './getTypesOfSelectedEntities'

export default class {
  constructor(editor, commander, selectionModel) {
    this._editor = editor
    this._commander = commander
    this._selectionModel = selectionModel
    this._copiedEntityTypes = []
  }

  get hasItem() {
    return this._copiedEntityTypes.length > 0
  }

  copyEntities() {
    this._copiedEntityTypes = getTypesOfSelectedEntities(this._selectionModel)
    this._editor.eventEmitter.emit('textae.clipBoard.change')
  }

  pasteEntities() {
    this._commander.invoke(
      this._commander.factory.pasteTypesToSelectedSpansCommand(
        this._copiedEntityTypes
      )
    )
  }
}
