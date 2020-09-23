export default class {
  constructor(editor, selectionModel) {
    this._editor = editor
    this._selectionModel = selectionModel
  }

  up() {
    // When one span is selected.
    if (this._selectionModel.span.single) {
      const grid = this._selectionModel.span.single.gridElement
      const entity = grid.querySelector('.textae-editor__entity')
      this._selectionModel.selectEntity(entity)
    }
  }

  down() {
    if (this._selectedType) {
      this._selectionModel.selectSingleSpanById(this._spanIdOfSelectedType)
    }
  }

  get _selectedType() {
    return this._editor[0].querySelector('.textae-editor__entity.ui-selected')
  }

  get _spanIdOfSelectedType() {
    return this._selectedType.closest('.textae-editor__grid').id.substring(1)
  }
}
