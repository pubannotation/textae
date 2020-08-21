export default class {
  constructor(editor, selectionModel) {
    this._editor = editor
    this._selectionModel = selectionModel
  }

  left(shiftKey) {
    const nextSpan = this._searchLeft('textae-editor__span')
    if (nextSpan) {
      this._selectionModel.selectSpan(nextSpan, shiftKey)
      return
    }

    const nextEntity = this._searchLeft('textae-editor__entity')
    if (nextEntity) {
      this._selectionModel.selectEntity(nextEntity, shiftKey)
    }
  }

  right(shiftKey) {
    const nextSpan = this._searchRight('textae-editor__span')
    if (nextSpan) {
      this._selectionModel.selectSpan(nextSpan, shiftKey)
      return
    }

    const nextEntity = this._searchRight('textae-editor__entity')
    if (nextEntity) {
      this._selectionModel.selectEntity(nextEntity, shiftKey)
    }
  }

  _searchLeft(className) {
    const allElements = this._getAllElementsOf(className)
    const firstSelectedIndex = [...allElements].findIndex((el) =>
      el.classList.contains('ui-selected')
    )

    if (firstSelectedIndex > 0) {
      return allElements[firstSelectedIndex - 1]
    }
  }

  _searchRight(className) {
    const allElements = this._getAllElementsOf(className)
    const lastSelectedIndex = [...allElements]
      .reverse()
      .findIndex((el) => el.classList.contains('ui-selected'))

    if (allElements.length - lastSelectedIndex > 0) {
      return allElements[allElements.length - lastSelectedIndex]
    }
  }

  _getAllElementsOf(className) {
    return this._editor[0].querySelectorAll(`.${className}`)
  }
}
