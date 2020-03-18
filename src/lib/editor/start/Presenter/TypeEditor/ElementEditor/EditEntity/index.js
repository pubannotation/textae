import SelectEnd from '../../SelectEnd'
import SelectSpan from './SelectSpan'
import EditEntityHandler from './EditEntityHandler'
import bindMouseEvents from './bindMouseEvents'

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
    this._selectEnd = new SelectEnd(
      editor,
      annotationData,
      selectionModel,
      commander,
      pushButtons
    )
    this._spanConfig = spanConfig
    this._selectSpan = new SelectSpan(annotationData, selectionModel)
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
    this._commander = commander
    this._annotationData = annotationData
    this._editAttribute = editAttribute
    this._deleteAttribute = deleteAttribute
  }

  init() {
    return bindMouseEvents(
      this._editor,
      this._selectEnd,
      this._spanConfig,
      this._selectSpan,
      this._selectionModel
    )
  }

  get entityHandler() {
    return new EditEntityHandler(
      this._typeDefinition,
      this._commander,
      this._annotationData,
      this._selectionModel,
      this._editAttribute,
      this._deleteAttribute
    )
  }
}
