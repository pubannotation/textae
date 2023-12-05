import clearTextSelection from '../clearTextSelection'
import SelectionWrapper from '../SelectionWrapper'
import selectSpan from '../selectSpan'
import isRangeInTextBox from '../isRangeInTextBox'

export default class MouseEventHandler {
  /**
   *
   * @param {import('./SpanEditor').default} spanEditor
   */
  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    spanEditor,
    pallet
  ) {
    this._editorHTMLElement = editorHTMLElement
    this._annotationModel = annotationModel
    this._selectionModel = selectionModel
    this._spanEditor = spanEditor
    this._pallet = pallet
  }

  bodyClicked() {
    this._pallet.hide()
    this._selectionModel.removeAll()
  }

  textBoxClicked() {
    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this._pallet.hide()
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

  blockSpanClicked() {
    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this._pallet.hide()
      clearTextSelection()
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

  // Mouse events to the block span are handled by the hit area instead,
  // to show the block span shifted up half a line.
  blockHitAreaClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    // When you create a block span and
    // click on another block span while holding down the Shift key,
    // the Selection type will be 'None'.
    if (selection.type === 'Caret' || selection.type === 'None') {
      const spanId = e.target.dataset.id

      this._selectSpanAndEntity(e, spanId)
    }
  }

  styleSpanClicked(e) {
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
      e.stopPropagation()
    }
  }

  denotationSpanClicked(e) {
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
      e.stopPropagation()
    }
  }

  signboardClicked() {
    this._editorHTMLElement.focus()
  }

  typeValuesClicked(event, entityID) {
    const entity = this._annotationModel.entity.get(entityID)

    if (entity.isBlock) {
      if (event.ctrlKey || event.metaKey) {
        this._selectionModel.entity.toggle(entityID)
      } else {
        this._selectionModel.selectEntity(entityID)
      }

      // Select span of the selected entity.
      const spans = this._selectionModel.entity.all
        .map((entity) => entity.span)
        .map((span) => span.id)
      this._selectionModel.add('span', spans)
    }
  }

  _selectSpanAndEntity(event, spanID) {
    const selectedSpanID = this._selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this._annotationModel.span.rangeBlockSpan(selectedSpanID, spanID)
        : []

    selectSpan(this._selectionModel, rangeOfSpans, event, spanID)

    // Select entities of the selected span.
    // Block is a first entity of the span.
    const entities = this._selectionModel.span.all
      .map((span) => span.entities.at(0))
      .map((entity) => entity.id)

    this._selectionModel.add('entity', entities)
  }
}
