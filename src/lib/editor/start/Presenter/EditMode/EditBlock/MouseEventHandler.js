import clearTextSelection from '../clearTextSelection'
import SelectionWrapper from '../SelectionWrapper'
import getEntityHTMLelementFromChild from '../../../getEntityHTMLelementFromChild'

export default class MouseEventHandler {
  constructor(editor, annotationData, selectionModel, spanEditor, pallet) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._spanEditor = spanEditor
    this._pallet = pallet
  }

  bodyClicked() {
    this._pallet.hide()
    this._selectionModel.clear()
  }

  textBoxClicked(e) {
    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this._pallet.hide()
      this._selectionModel.clear()
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
      e.stopPropagation()
    }
  }

  blockSpanClicked() {
    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      clearTextSelection()
      this._selectionModel.clear()
    }

    if (selection.type === 'Range') {
      this._spanEditor.editFor(new SelectionWrapper())
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
    const entity = this._annotationData.entity.get(entityId)

    if (entity.isBlock) {
      this._selectionModel.selectEntity(entityId, e.ctrlKey || e.metaKey)

      // Select span of the selected entity.
      for (const { span } of this._selectionModel.entity.all) {
        this._selectionModel.span.add(span.id)
      }
    }
  }

  _selectSpanAndEntity(event, spanID) {
    const selectedSpanID = this._selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this._annotationData.span.rangeBlockSpan(selectedSpanID, spanID)
        : []

    if (rangeOfSpans.length) {
      this._selectionModel.selectSpanRange(rangeOfSpans)
    } else {
      if (event.ctrlKey || event.metaKey) {
        this._selectionModel.toggleSpan(spanID)
      } else {
        this._selectionModel.selectSpan(spanID)
      }
    }

    // Select entities of the selected span.
    for (const { entities } of this._selectionModel.span.all) {
      // Block span has just one entity.
      this._selectionModel.selectEntityById(entities[0].id)
    }
  }
}
