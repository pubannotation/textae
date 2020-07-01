import EditEntityHandler from './EditEntityHandler'
import bindMouseEvents from './bindMouseEvents'
import SpanEditor from './SpanEditor'
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

    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )

    bindTextaeEvents(editor, spanEditor, selectionModel)
  }

  init() {
    return bindMouseEvents(this._editor)
  }

  get entityHandler() {
    return this._entityHandler
  }
}
