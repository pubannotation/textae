import isNodeSpan from '../isNodeSpan'
import isNodeTextBox from '../isNodeTextBox'

export default class {
  constructor(selection) {
    this._selection = selection
  }

  isAnchorNodeIn(node) {
    return this._selection.anchorNode.parentNode === node
  }

  get isAnchorNodeInSpan() {
    return isNodeSpan(this._selection.anchorNode.parentNode)
  }

  get isAnchorNodeInTextBox() {
    return isNodeTextBox(this._selection.anchorNode.parentNode)
  }

  get isAnchorOneDownUnderFocus() {
    return (
      this._selection.anchorNode.parentNode.parentNode ===
      this._selection.focusNode.parentNode
    )
  }

  get isFocusNodeInSpan() {
    return isNodeSpan(this._selection.focusNode.parentNode)
  }

  get isFocusNodeInTextBox() {
    return isNodeTextBox(this._selection.focusNode.parentNode)
  }

  get isAnchrNodeInSpanOrTextBox() {
    const node = this._selection.anchorNode.parentNode
    return isNodeSpan(node) || isNodeTextBox(node)
  }
}
