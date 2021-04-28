import clearTextSelection from '../clearTextSelection'
import SelectionWrapper from '../SelectionWrapper'
import getEntityHTMLelementFromChild from '../../../getEntityHTMLelementFromChild'
import selectSpan from '../selectSpan'

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
    this._selectionModel.removeAll()
  }

  textBoxClicked(event) {
    this._pallet.hide()

    const selection = window.getSelection()

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
      event.stopPropagation()
    } else {
      this._selectionModel.removeAll()
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
      this._selectionModel.removeAll()
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
        this._selectionModel.removeAll()
      }
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
    }
  }

  signboardClicked() {
    this._editor.focus()
  }

  typeValuesClicked(e) {
    const entityId = getEntityHTMLelementFromChild(e.target).dataset.id

    if (this._annotationData.entity.get(entityId).isDenotation) {
      if (e.ctrlKey || e.metaKey) {
        this._selectionModel.entity.toggle(entityId)
      } else {
        this._selectionModel.selectEntity(entityId)
      }
    }
  }

  _selectSpan(event, spanID) {
    const selectedSpanID = this._selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this._annotationData.span.rangeDenotationSpan(selectedSpanID, spanID)
        : []

    selectSpan(this._selectionModel, rangeOfSpans, event, spanID)
  }
}
