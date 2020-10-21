import isNodeSpan from '../../../isNodeSpan'
import isNodeTextBox from '../../../isNodeTextBox'
import isNodeStyleSpan from '../../../isNodeStyleSpan'
import getSelectionSnapShot from './getSelectionSnapShot'

export default class {
  constructor() {
    this.selection = getSelectionSnapShot()
  }

  get isParentOfAnchorNodeTextBox() {
    return isNodeTextBox(this.parentOfAnchorNode)
  }

  get isParentOfAnchorNodeSpan() {
    return isNodeSpan(this.parentOfAnchorNode)
  }

  get isParentOfAnchorNodeStyleSpan() {
    return isNodeStyleSpan(this.parentOfAnchorNode)
  }

  get isParentOfFocusNodeTextBox() {
    return isNodeTextBox(this.parentOfFocusNode)
  }

  get isParentOfFocusNodeSpan() {
    return isNodeSpan(this.parentOfFocusNode)
  }

  get isParentOfFocusNodeStyleSpan() {
    return isNodeStyleSpan(this.parentOfFocusNode)
  }

  get isParentOfAnchorNodeAndFocusedNodeSame() {
    return this.parentOfAnchorNode === this.parentOfFocusNode
  }

  get isParentsParentOfAnchorNodeAndFocusedNodeSame() {
    return (
      this.parentOfAnchorNode.parentElement ===
      this.parentOfFocusNode.parentElement
    )
  }

  get isAnchorNodeParentIsDescendantOfSelectedSpan() {
    return this.parentOfAnchorNode.closest('.ui-selected')
  }

  get isForcusOneDownUnderAnchor() {
    return this.parentOfAnchorNode === this.parentOfFocusNode.parentElement
  }

  get ancestorSpanOfAnchorNode() {
    return this.parentOfAnchorNode.closest('.textae-editor__span')
  }

  get ancestorSpanOfFocusNode() {
    return this.parentOfFocusNode.closest('.textae-editor__span')
  }

  get isAnchorOneDownUnderFocus() {
    return this.parentOfAnchorNode.parentElement === this.parentOfFocusNode
  }

  get parentOfAnchorNode() {
    return this.selection.anchorNode.parentElement
  }

  get parentOfFocusNode() {
    return this.selection.focusNode.parentElement
  }
}
