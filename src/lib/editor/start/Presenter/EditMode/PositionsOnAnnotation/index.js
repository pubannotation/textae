import getPosition from './getPosition'

export default class PositionsOnAnnotation {
  constructor(spanModelContainer, selectionWrapper) {
    this._spanContainer = spanModelContainer
    this._selection = selectionWrapper.selection
  }

  get anchor() {
    const position = getPosition(
      this._spanContainer,
      this._selection.anchorNode
    )
    return position + this._selection.anchorOffset
  }

  get focus() {
    const position = getPosition(this._spanContainer, this._selection.focusNode)
    return position + this._selection.focusOffset
  }
}
