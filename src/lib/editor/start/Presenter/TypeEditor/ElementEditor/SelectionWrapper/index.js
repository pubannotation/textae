import isNodeSpan from '../isNodeSpan'
import isNodeTextBox from '../isNodeTextBox'
import isNodeStyleSpan from '../isNodeStyleSpan'

export default class {
  constructor(selection) {
    this.selection = selection
  }

  isAnchorNodeIn(node) {
    return this.selection.anchorNode.parentNode === node
  }

  get isAnchorNodeInSpan() {
    return isNodeSpan(this.selection.anchorNode.parentNode)
  }

  get isAnchorNodeInStyleSpan() {
    return isNodeStyleSpan(this.selection.anchorNode.parentNode)
  }

  get isAnchorNodeInTextBox() {
    return isNodeTextBox(this.selection.anchorNode.parentNode)
  }

  get isAnchorOneDownUnderFocus() {
    return (
      this.selection.anchorNode.parentNode.parentNode ===
      this.selection.focusNode.parentNode
    )
  }

  get isFocusNodeInSpan() {
    return isNodeSpan(this.selection.focusNode.parentNode)
  }

  get isFocusNodeInTextBox() {
    return isNodeTextBox(this.selection.focusNode.parentNode)
  }

  get isFocusNodeInStyleSpan() {
    return isNodeStyleSpan(this.selection.focusNode.parentNode)
  }

  get isAnchrNodeInSpanOrTextBox() {
    const node = this.selection.anchorNode.parentNode
    return isNodeSpan(node) || isNodeTextBox(node)
  }

  get isAnchrNodeInStyleSpanOrTextBox() {
    const node = this.selection.anchorNode.parentNode
    return isNodeStyleSpan(node) || isNodeTextBox(node)
  }

  get isAnchrNodeInSpanOrStyleSpanOrTextBox() {
    const node = this.selection.anchorNode.parentNode
    return isNodeSpan(node) || isNodeStyleSpan(node) || isNodeTextBox(node)
  }
}
