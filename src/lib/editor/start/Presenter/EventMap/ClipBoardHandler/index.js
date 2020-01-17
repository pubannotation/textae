import copyEntities from './copyEntities'

export default class {
  constructor(commander, selectionModel, clipBoard) {
    this._commander = commander
    this._selectionModel = selectionModel
    this._clipBoard = clipBoard
  }

  copyEntities() {
    copyEntities(this._clipBoard, this._selectionModel)
  }

  pasteEntities() {
    this._commander.invoke(
      this._commander.factory.pasteTypesToSelectedSpansCommand(
        this._clipBoard.clipBoard
      )
    )
  }
}
