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
      pushButtons
    )

    editor.eventEmitter
      .on('textae.editor.editEntity.paragraph.mouseup', () =>
        new SelectionWrapper(window.getSelection()).showAlertIfOtherParagraph()
      )
      .on('textae.editor.editEntity.paragraph.click', (e) => {
        const selection = window.getSelection()

        // if text is seleceted
        if (!selection.isCollapsed) {
          spanEditor.selectEndOnText({
            spanConfig,
            selection: getSelectionSnapShot()
          })
          e.stopPropagation()
        }
      })
      .on('textae.editor.editEntity.span.mouseup', (e) =>
        spanClicked(
          () =>
            spanEditor.selectEndOnSpan({
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
    return this._entityHandler
  }
}
