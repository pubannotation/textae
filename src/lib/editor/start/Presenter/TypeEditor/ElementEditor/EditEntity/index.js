import SelectionWrapper from '../SelectionWrapper'
import SelectSpan from './SelectSpan'
import EditEntityHandler from './EditEntityHandler'
import bindMouseEvents from './bindMouseEvents'
import SpanEditor from './SpanEditor'
import getSelectionSnapShot from './getSelectionSnapShot'
import typeValeusClicked from './typeValuesClicked'
import entityClicked from './entityClicked'
import spanClicked from './spanClicked'

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
    this._typeDefinition = typeDefinition
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._editAttribute = editAttribute
    this._deleteAttribute = deleteAttribute

    editor.eventEmitter
      .on('textae.editor.editEntity.paragraph.mouseup', () =>
        new SelectionWrapper(window.getSelection()).showAlertIfOtherParagraph()
      )
      .on('textae.editor.editEntity.paragraph.click', (e) => {
        const selection = window.getSelection()

        // if text is seleceted
        if (!selection.isCollapsed) {
          new SpanEditor(
            editor,
            annotationData,
            selectionModel,
            commander,
            pushButtons
          ).selectEndOnText({
            spanConfig,
            selection: getSelectionSnapShot()
          })
          e.stopPropagation()
        }
      })
      .on('textae.editor.editEntity.span.mouseup', (e) =>
        spanClicked(
          () =>
            new SpanEditor(
              editor,
              annotationData,
              selectionModel,
              commander,
              pushButtons
            ).selectEndOnSpan({
              spanConfig,
              selection: getSelectionSnapShot()
            }),
          new SelectSpan(annotationData, selectionModel),
          e
        )
      )
      .on('textae.editor.editEntity.entity.click', (e) =>
        entityClicked(selectionModel, e)
      )
      .on('textae.editor.editEntity.type.click', () => this._editor.focus())
      .on('textae.editor.editEntity.typeValues.click', (e) =>
        typeValeusClicked(selectionModel, e)
      )
  }

  init() {
    return bindMouseEvents(this._editor)
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
