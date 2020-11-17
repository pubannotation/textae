import clearTextSelection from '../../clearTextSelection'
import selectSpan from '../EditEntity/MouseEventHandler/selectSpan'
import SelectionWrapper from '../EditEntity/MouseEventHandler/SelectionWrapper'

export default class MouseEventHandler {
  constructor(annotationData, selectionModel, spanEditor) {
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._spanEditor = spanEditor
  }

  textBoxClicked(e) {
    const selection = window.getSelection()
    if (selection.type === 'Caret') {
      this._selectionModel.clear()
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
      e.stopPropagation()
    }
  }

  blockSpanClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this._selectSpan(e, e.target.id)
    }
  }

  blockHitAreaClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this._selectSpan(e, e.target.dataset.id)
    }
  }

  _selectSpan(event, spanId) {
    selectSpan(this._annotationData, this._selectionModel, event, spanId)
  }
}
