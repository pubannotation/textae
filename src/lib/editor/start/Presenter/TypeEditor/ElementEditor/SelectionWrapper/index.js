import isNodeSpan from '../isNodeSpan'
import isNodeTextBox from '../isNodeTextBox'

export default class {
  constructor(selection) {
    this._selection = selection
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
