import isNodeDenotationSpan from '../isNodeDenotationSpan'
import isNodeTextBox from '../isNodeTextBox'
import isNodeStyleSpan from '../isNodeStyleSpan'
import isNodeBlockSpan from '../isNodeBlockSpan'
import PositionsOnAnnotation from '../PositionsOnAnnotation'

export default class SelectionWrapper {
  constructor(spanModelContainer) {
    this.selection = window.getSelection()
    this._spanModelContainer = spanModelContainer
  }

  get isParentOfAnchorNodeTextBox() {
    return isNodeTextBox(this.parentOfAnchorNode)
  }

  get isParentOfAnchorNodeDenotationSpan() {
    return isNodeDenotationSpan(this.parentOfAnchorNode)
  }

  get isParentOfAnchorNodeBlockSpan() {
    return isNodeBlockSpan(this.parentOfAnchorNode)
  }

  get isParentOfAnchorNodeStyleSpan() {
    return isNodeStyleSpan(this.parentOfAnchorNode)
  }

  get isParentOfFocusNodeTextBox() {
    return isNodeTextBox(this.parentOfFocusNode)
  }

  get isParentOfFocusNodeDenotationSpan() {
    return isNodeDenotationSpan(this.parentOfFocusNode)
  }

  get isParentOfFocusNodeBlockSpan() {
    return isNodeBlockSpan(this.parentOfFocusNode)
  }

  get isParentOfFocusNodeStyleSpan() {
    return isNodeStyleSpan(this.parentOfFocusNode)
  }

  get isParentOfBothNodesSame() {
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

  get isFocusOneDownUnderAnchor() {
    return this.parentOfAnchorNode === this.parentOfFocusNode.parentElement
  }

  get ancestorDenotationSpanOfAnchorNode() {
    return this.parentOfAnchorNode.closest('.textae-editor__span')
  }

  get ancestorDenotationSpanOfFocusNode() {
    return this.parentOfFocusNode.closest('.textae-editor__span')
  }

  get ancestorBlockSpanOfAnchorNode() {
    return this.parentOfAnchorNode.closest('.textae-editor__block')
  }

  get ancestorBlockSpanOfFocusNode() {
    return this.parentOfFocusNode.closest('.textae-editor__block')
  }

  get doesFitInOneBlockSpan() {
    return (
      this.ancestorBlockSpanOfAnchorNode === this.ancestorBlockSpanOfFocusNode
    )
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

  getPositionsOnAnnotation() {
    return new PositionsOnAnnotation(this._spanModelContainer, this)
  }
}
