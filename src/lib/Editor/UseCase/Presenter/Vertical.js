export default class Vertical {
  constructor(editorHTMLElement, selectionModel) {
    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
  }

  up() {
    // When one span is selected.
    if (this._selectionModel.span.single) {
      const grid = this._selectionModel.span.single.gridElement
      const entity = grid.querySelector('.textae-editor__signboard')
      this._selectionModel.selectEntity(entity.dataset.id)
    }
  }

  down() {
    const selectedEntityHtmlelement = this._editorHTMLElement.querySelector(
      '.textae-editor__signboard--selected'
    )

    if (selectedEntityHtmlelement) {
      const spanId = selectedEntityHtmlelement
        .closest('.textae-editor__grid')
        .id.substring(1)

      this._selectionModel.selectSpan(spanId)
    }
  }
}
