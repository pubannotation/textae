import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    typeDefinition
  ) {
    this._editor = editor
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
    this._commander = commander
    this._annotationData = annotationData
  }

  init() {
    return bindMouseEvents(
      this._editor,
      this._selectionModel,
      this._commander,
      this._typeDefinition
    )
  }

  get relationHandler() {
    return new EditRelationHandler(
      this._typeDefinition,
      this._commander,
      this._annotationData,
      this._selectionModel
    )
  }
}
