import getTypesOfSelectedEntities from './getTypesOfSelectedEntities'

export default class {
  constructor(commander, selectionModel) {
    this._commander = commander
    this._selectionModel = selectionModel
    this._copiedEntityTypes = []
  }

  get hasItem() {
    return this._copiedEntityTypes.length > 0
  }

  copyEntities() {
    this._copiedEntityTypes = getTypesOfSelectedEntities(this._selectionModel)
  }

  pasteEntities() {
    this._commander.invoke(
      this._commander.factory.pasteTypesToSelectedSpansCommand(
        this._copiedEntityTypes
      )
    )
  }
}
