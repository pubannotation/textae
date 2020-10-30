import EditEntityHandler from './EditEntityHandler'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'

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
    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )
    this._mouseEventHandler = new MouseEventHandler(
      editor,
      annotationData,
      selectionModel,
      entityPallet,
      spanEditor
    )
  }

  init() {
    return bindMouseEvents(this._editor, this._mouseEventHandler)
  }

  get entityHandler() {
    return this._entityHandler
  }
}
