import clearTextSelection from '../clearTextSelection'
import SelectionWrapper from '../SelectionWrapper'
import selectSpan from '../selectSpan'
import isRangeInTextBox from '../isRangeInTextBox'

export default class MouseEventHandler {
  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    pallet,
    spanEditor
  ) {
    this._annotationModel = annotationModel
    this._selectionModel = selectionModel
    this._spanEditor = spanEditor
    this._editorHTMLElement = editorHTMLElement
    this._pallet = pallet
  }

  bodyClicked() {
    this._pallet.hide()
    this._selectionModel.removeAll()
  }

  textBoxClicked() {
    this._pallet.hide()

    const selection = window.getSelection()

    if (
      isRangeInTextBox(
        selection,
        this._editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this._spanEditor.editFor(new SelectionWrapper(this._annotationModel.span))
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

    if (
      isRangeInTextBox(
        selection,
        this._editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this._spanEditor.editFor(new SelectionWrapper(this._annotationModel.span))
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

    if (
      isRangeInTextBox(
        selection,
        this._editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this._spanEditor.editFor(new SelectionWrapper(this._annotationModel.span))
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

    if (
      isRangeInTextBox(
        selection,
        this._editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this._spanEditor.editFor(new SelectionWrapper(this._annotationModel.span))
    }
  }

  signboardClicked() {
    this._editorHTMLElement.focus()
  }

  typeValuesClicked(event, entityID) {
    if (this._annotationModel.entity.get(entityID).isDenotation) {
      if (event.ctrlKey || event.metaKey) {
        this._selectionModel.entity.toggle(entityID)
      } else {
        this._selectionModel.selectEntity(entityID)
      }
    }
  }

  _selectSpan(event, spanID) {
    const selectedSpanID = this._selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this._annotationModel.span.rangeDenotationSpan(selectedSpanID, spanID)
        : []

    selectSpan(this._selectionModel, rangeOfSpans, event, spanID)
  }
}
