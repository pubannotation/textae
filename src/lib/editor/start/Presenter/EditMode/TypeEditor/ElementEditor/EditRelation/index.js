import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    typeDefinition,
    relationPallet
  ) {
    this._editor = editor
    this._handler = new EditRelationHandler(
      typeDefinition,
      commander,
      annotationData,
      selectionModel
    )
    this._mouseEventHandler = new MouseEventHandler(
      editor,
      selectionModel,
      commander,
      typeDefinition,
      relationPallet
    )
  }

  init() {
    return bindMouseEvents(this._editor, this._mouseEventHandler)
  }

  get relationHandler() {
    return this._handler
  }
}
