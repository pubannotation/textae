import copyEntities from './copyEntities'

export default class {
  constructor(command, annotationData, selectionModel, clipBoard) {
    this._command = command
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._clipBoard = clipBoard
  }

  copyEntities() {
    copyEntities(this._clipBoard, this._selectionModel, this._annotationData)
  }

  pasteEntities() {
    this._command.invoke(
      this._command.factory.pasteTypesToSelectedSpansCommand(
        this._clipBoard.clipBoard
      )
    )
  }
}
