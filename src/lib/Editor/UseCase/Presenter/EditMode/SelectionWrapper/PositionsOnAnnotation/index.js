import getOffsetFromParent from './getOffsetFromParent'
import getParentOffset from './getParentOffset'

export default class PositionsOnAnnotation {
  constructor(spanModelContainer, selectionWrapper) {
    this._spanModelContainer = spanModelContainer
    this._selection = selectionWrapper.selection
  }

  get anchor() {
    const position =
      getParentOffset(this._spanModelContainer, this._selection.anchorNode) +
      getOffsetFromParent(this._selection.anchorNode)

    return position + this._selection.anchorOffset
  }

  get focus() {
    const position =
      getParentOffset(this._spanModelContainer, this._selection.focusNode) +
      getOffsetFromParent(this._selection.focusNode)

    return position + this._selection.focusOffset
  }
}
