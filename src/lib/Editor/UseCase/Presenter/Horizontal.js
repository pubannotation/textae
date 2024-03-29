export default class Horizontal {
  constructor(editorHTMLElement, selectionModel) {
    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
  }

  left(shiftKey) {
    const nextSpan = this._searchLeft('.textae-editor__span')
    if (nextSpan) {
      if (shiftKey) {
        this._selectionModel.add('span', [nextSpan.id])
      } else {
        this._selectionModel.selectSpan(nextSpan.id)
      }
      return
    }

    const nextEntity = this._searchLeft(
      '.textae-editor__grid .textae-editor__signboard'
    )
    if (nextEntity) {
      if (shiftKey) {
        this._selectionModel.add('entity', [nextEntity.dataset.id])
      } else {
        this._selectionModel.selectEntity(nextEntity.dataset.id)
      }
    }
  }

  right(shiftKey) {
    const nextSpan = this._searchRight('.textae-editor__span')
    if (nextSpan) {
      if (shiftKey) {
        this._selectionModel.add('span', [nextSpan.id])
      } else {
        this._selectionModel.selectSpan(nextSpan.id)
      }
      return
    }

    const nextEntity = this._searchRight(
      '.textae-editor__grid .textae-editor__signboard'
    )
    if (nextEntity) {
      if (shiftKey) {
        this._selectionModel.add('entity', [nextEntity.dataset.id])
      } else {
        this._selectionModel.selectEntity(nextEntity.dataset.id)
      }
    }
  }

  _searchLeft(selector) {
    const elements = this._editorHTMLElement.querySelectorAll(selector)
    const firstSelectedIndex = [...elements].findIndex(
      (el) =>
        el.classList.contains('ui-selected') ||
        el.classList.contains('textae-editor__signboard--selected')
    )

    if (firstSelectedIndex > 0) {
      return elements[firstSelectedIndex - 1]
    }
  }

  _searchRight(selector) {
    const elements = this._editorHTMLElement.querySelectorAll(selector)
    const lastSelectedIndex = [...elements]
      .reverse()
      .findIndex(
        (el) =>
          el.classList.contains('ui-selected') ||
          el.classList.contains('textae-editor__signboard--selected')
      )

    if (elements.length - lastSelectedIndex > 0) {
      return elements[elements.length - lastSelectedIndex]
    }
  }
}
