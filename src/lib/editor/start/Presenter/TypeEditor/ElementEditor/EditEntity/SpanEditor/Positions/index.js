import getPosition from './getPosition'

export default class {
  constructor(annotationData, selection) {
    this._annotationData = annotationData
    this._selection = selection
  }

  get anchor() {
    const position = getPosition(
      this._annotationData.span,
      this._selection.anchorNode
    )
    return position + this._selection.anchorOffset
  }

  get focus() {
    const position = getPosition(
      this._annotationData.span,
      this._selection.focusNode
    )
    return position + this._selection.focusOffset
  }

  // switch the position when the selection is made from right to left
  get begin() {
    if (this.anchor < this.focus) {
      return this.anchor
    }

    return this.focus
  }

  // switch the position when the selection is made from right to left
  get end() {
    if (this.anchor < this.focus) {
      return this.focus
    }

    return this.anchor
  }
}
