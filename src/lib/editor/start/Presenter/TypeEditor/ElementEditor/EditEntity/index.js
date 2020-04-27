import SelectSpan from './SelectSpan'
import EditEntityHandler from './EditEntityHandler'
import bindMouseEvents from './bindMouseEvents'
import SpanEditor from './SpanEditor'
import getSelectionSnapShot from './getSelectionSnapShot'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    pushButtons,
    typeDefinition,
    spanConfig,
    editAttribute,
    deleteAttribute
  ) {
    this._editor = editor
    this._spanConfig = spanConfig
    this._selectSpan = new SelectSpan(annotationData, selectionModel)
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
    this._commander = commander
    this._annotationData = annotationData
    this._pushButtons = pushButtons
    this._editAttribute = editAttribute
    this._deleteAttribute = deleteAttribute
  }

  init() {
    return bindMouseEvents(
      this._editor,
      this._selectSpan,
      this._selectionModel,
      () =>
        new SpanEditor(
          this._editor,
          this._annotationData,
          this._selectionModel,
          this._commander,
          this._pushButtons
        ).selectEndOnText({
          spanConfig: this._spanConfig,
          selection: getSelectionSnapShot()
        }),
      () =>
        new SpanEditor(
          this._editor,
          this._annotationData,
          this._selectionModel,
          this._commander,
          this._pushButtons
        ).selectEndOnSpan({
          spanConfig: this._spanConfig,
          selection: getSelectionSnapShot()
        })
    )
  }

  get entityHandler() {
    return new EditEntityHandler(
      this._editor,
      this._typeDefinition,
      this._commander,
      this._annotationData,
      this._selectionModel,
      this._editAttribute,
      this._deleteAttribute
    )
  }
}
