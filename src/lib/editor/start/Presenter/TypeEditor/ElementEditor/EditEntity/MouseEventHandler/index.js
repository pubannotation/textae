import clearTextSelection from '../../../clearTextSelection'
import selectSpan from './selectSpan'
import SelectionWrapper from './SelectionWrapper'
import SpanEditor from './SpanEditor'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    spanConfig
  ) {
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._spanEditor = new SpanEditor(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      spanConfig
    )
  }

  textBoxClicked(event) {
    const selection = window.getSelection()

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
      event.stopPropagation()
    } else {
      this._selectionModel.clear()
    }
  }

  spanClicked(event) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (event.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this._selectSpan(event, event.target.id)
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
    }
  }

  styleSpanClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      const span = e.target.closest('.textae-editor__span')
      if (span) {
        this._selectSpan(e, span.id)
      }
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
    }
  }

  _selectSpan(event, spanId) {
    selectSpan(this._annotationData, this._selectionModel, event, spanId)
  }
}
