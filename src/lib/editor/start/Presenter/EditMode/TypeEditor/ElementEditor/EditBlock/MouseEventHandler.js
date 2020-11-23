import clearTextSelection from '../../clearTextSelection'
import selectSpan from '../EditEntity/MouseEventHandler/selectSpan'
import SelectionWrapper from '../EditEntity/MouseEventHandler/SelectionWrapper'
import getEntityHTMLelementFromChild from '../../../../../getEntityHTMLelementFromChild'

export default class MouseEventHandler {
  constructor(editor, annotationData, selectionModel, spanEditor) {
    this._editor = editor
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

  // Mouse events to the block span are handled by the background instead,
  // to show the block span shifted up half a line.
  blockSpanClicked() {
    clearTextSelection()
    this._selectionModel.clear()
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

  styleSpanClicked(e) {
    const selection = window.getSelection()
    if (selection.type === 'Caret') {
      this._selectionModel.clear()
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
      e.stopPropagation()
    }
  }

  denotationSpanClicked(e) {
    const selection = window.getSelection()
    if (selection.type === 'Caret') {
      this._selectionModel.clear()
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
      e.stopPropagation()
    }
  }

  entityClicked() {
    this._editor.focus()
  }

  typeValuesClicked(e) {
    const entityId = getEntityHTMLelementFromChild(e.target).title

    if (this._annotationData.entity.get(entityId).isBlock) {
      this._selectionModel.selectEntity(entityId, e.ctrlKey || e.metaKey)
    }
  }

  _selectSpan(event, spanId) {
    selectSpan(this._annotationData, this._selectionModel, event, spanId)
  }
}
