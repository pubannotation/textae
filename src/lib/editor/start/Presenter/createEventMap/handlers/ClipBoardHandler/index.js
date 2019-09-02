import copyEntities from './copyEntities'

export default class {
  constructor(commander, annotationData, selectionModel, clipBoard) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._clipBoard = clipBoard
  }

  copyEntities() {
    copyEntities(this._clipBoard, this._selectionModel, this._annotationData)
  }

  pasteEntities() {
    this._commander.invoke(
      this._commander.factory.pasteTypesToSelectedSpansCommand(
        this._clipBoard.clipBoard
      )
    )
  }
}
