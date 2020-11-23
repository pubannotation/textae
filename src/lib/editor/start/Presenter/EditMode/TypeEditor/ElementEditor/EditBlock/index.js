import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'

export default class EditBlock {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController
  ) {
    this._editor = editor
    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      spanConfig,
      commander,
      buttonController,
      selectionModel
    )
    this._mouseEventHandler = new MouseEventHandler(
      editor,
      annotationData,
      selectionModel,
      spanEditor
    )
  }

  init() {
    return bindMouseEvents(this._editor, this._mouseEventHandler)
  }
}
