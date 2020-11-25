import clearTextSelection from '../clearTextSelection'
import selectSpan from '../selectSpan'
import SelectionWrapper from '../SelectionWrapper'
import getEntityHTMLelementFromChild from '../../../getEntityHTMLelementFromChild'

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

    // When you create a block span and
    // click on another block span while holding down the Shift key,
    // the Selection type will be 'None'.
    if (selection.type === 'Caret' || selection.type === 'None') {
      const spanId = e.target.dataset.id

      selectSpan(this._selectionModel, e, spanId, (firstId, secondId) =>
        this._annotationData.span.rangeBlockSpan(firstId, secondId)
      )

      // Select entities of the selected span.
      for (const { entities } of this._selectionModel.span.all) {
        // Block span has just one entity.
        this._selectionModel.selectEntityById(entities[0].id)
      }
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
        this._selectionModel.selectSpanById(span.id)
      }
    }
  }
}
