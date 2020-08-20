import getTypeDomOfEntityDom from '../../getTypeDomOfEntityDom'

export default class {
  constructor(editor, selectionModel) {
    this._editor = editor
    this._selectionModel = selectionModel
  }

  up() {
    // When one span is selected.
    if (this._selectionModel.span.singleId) {
      this._selectionModel.selectAllEntitiesOfType(this._typeOfSelectedSpan)
      return
    }

    if (this._selectedTypeValues) {
      this._selectionModel.selectEntity(this._firstEntityOfSelectedTypeValues)
    }
  }

  down() {
    if (this._selectedTypeValues) {
      this._selectionModel.selectSingleSpanById(
        this._spanIdOfSelectedTypeValues
      )
      return
    }

    if (this._selectedSingleEntity) {
      this._selectionModel.selectAllEntitiesOfType(this._selectedSingleEntity)
    }
  }

  get _selectedTypeValues() {
    return this._editor[0].querySelector(
      '.textae-editor__type-values.ui-selected'
    )
  }

  get _typeOfSelectedSpan() {
    const grid = document.querySelector(
      `#G${this._selectionModel.span.singleId}`
    )

    if (grid) {
      return grid.querySelector('.textae-editor__type')
    }

    return null
  }

  get _firstEntityOfSelectedTypeValues() {
    const typeDom = getTypeDomOfEntityDom(this._selectedTypeValues)
    return typeDom.querySelector('.textae-editor__entity')
  }

  get _spanIdOfSelectedTypeValues() {
    return this._selectedTypeValues
      .closest('.textae-editor__grid')
      .id.substring(1)
  }

  get _selectedSingleEntity() {
    const selectedEnities = this._editor[0].querySelectorAll(
      '.textae-editor__entity.ui-selected'
    )

    if (selectedEnities.length === 1) {
      return selectedEnities[0]
    }

    return null
  }
}
