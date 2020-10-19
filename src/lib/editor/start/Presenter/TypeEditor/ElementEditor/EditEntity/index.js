import EditEntityHandler from './EditEntityHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import bindTextaeEvents from './bindTextaeEvents'

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
    deleteAttribute
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

    const mouseEventHandler = new MouseEventHandler(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )

    bindTextaeEvents(editor, mouseEventHandler, selectionModel)
  }

  init() {
    return bindMouseEvents(this._editor)
  }

  get entityHandler() {
    return this._entityHandler
  }
}
