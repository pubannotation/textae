import isNodeSpan from '../isNodeSpan'
import isNodTextBox from '../isNodeTextBox'

export default class {
  constructor(selection) {
    this._selection = selection
  }

  get isFocusNodeInSpan() {
    return isNodeSpan(this._selection.focusNode.parentNode)
  }

  get isFocusNodeInTextBox() {
    return isNodTextBox(this._selection.focusNode.parentNode)
  }

  get isAnchrNodeInSpanOrTextBox() {
    const node = this._selection.anchorNode.parentNode
    return isNodeSpan(node) || isNodTextBox(node)
  }
}
