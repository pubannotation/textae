import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'
import bindTextaeEvents from './bindTextaeEvents'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    typeDefinition
  ) {
    this._editor = editor
    this._relationHandler = new EditRelationHandler(
      typeDefinition,
      commander,
      annotationData,
      selectionModel
    )

    bindTextaeEvents(editor, selectionModel, commander, typeDefinition)
  }

  init() {
    return bindMouseEvents(this._editor)
  }

  get relationHandler() {
    return this._relationHandler
  }
}
