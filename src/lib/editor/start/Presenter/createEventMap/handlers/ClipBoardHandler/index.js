import copyEntities from './copyEntities'
import pasteEntities from './pasteEntities'

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
    pasteEntities(this._selectionModel, this._clipBoard, this._command)
  }
}
