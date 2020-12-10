import getPosition from './getPosition'

export default class Positions {
  constructor(annotationData, selectionWrapper) {
    this._annotationData = annotationData
    this._selection = selectionWrapper.selection
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
}
