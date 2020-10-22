import EditEntityHandler from './EditEntityHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    typeDefinition,
    spanConfig,
    editAttribute,
    deleteAttribute,
    entityPallet
  ) {
    this._editor = editor
    this._entityHandler = new EditEntityHandler(
      editor,
      typeDefinition,
      commander,
      annotationData,
      selectionModel,
      editAttribute,
      deleteAttribute
    )
    this._mouseEventHandler = new MouseEventHandler(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig,
      entityPallet
    )
  }

  init() {
    return bindMouseEvents(this._editor, this._mouseEventHandler)
  }

  get entityHandler() {
    return this._entityHandler
  }
}
