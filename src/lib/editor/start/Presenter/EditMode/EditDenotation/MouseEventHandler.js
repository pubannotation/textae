import clearTextSelection from '../clearTextSelection'
import SelectionWrapper from '../SelectionWrapper'
import getEntityHTMLelementFromChild from '../../../getEntityHTMLelementFromChild'

export default class MouseEventHandler {
  constructor(editor, annotationData, selectionModel, pallet, spanEditor) {
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._spanEditor = spanEditor
    this._editor = editor
    this._pallet = pallet
  }

  bodyClicked() {
    this._pallet.hide()
    this._selectionModel.clear()
  }

  textBoxClicked(event) {
    this._pallet.hide()

    const selection = window.getSelection()
    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
      event.stopPropagation()
    } else {
      this._selectionModel.clear()
    }
  }

  denotationSpanClicked(event) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (event.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    // When you create a denotation span and
    // click on another denotation span while holding down the Shift key,
    // the Selection type will be 'None'.
    if (selection.type === 'Caret' || selection.type === 'None') {
      this._selectSpan(event, event.target.id)
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
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
      this._selectionModel.clear()
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
      } else {
        this._selectionModel.clear()
      }
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
    }
  }

  entityClicked() {
    this._editor.focus()
  }

  typeValuesClicked(e) {
    const entityId = getEntityHTMLelementFromChild(e.target).title

    if (this._annotationData.entity.get(entityId).isDenotation) {
      this._selectionModel.selectEntity(entityId, e.ctrlKey || e.metaKey)
    }
  }

  _selectSpan(event, spanID) {
    const selectedSpanID = this._selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this._annotationData.span.rangeDenotationSpan(selectedSpanID, spanID)
        : []

    if (rangeOfSpans.length) {
      this._selectionModel.selectSpanRange(rangeOfSpans)
    } else {
      if (event.ctrlKey || event.metaKey) {
        this._selectionModel.toggleSpan(spanID)
      } else {
        this._selectionModel.selectSpanEx(spanID)
      }
    }
  }
}
