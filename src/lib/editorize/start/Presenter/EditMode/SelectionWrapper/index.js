import isNodeDenotationSpan from './isNodeDenotationSpan'
import isNodeTextBox from '../isNodeTextBox'
import isNodeStyleSpan from './isNodeStyleSpan'
import isNodeBlockSpan from './isNodeBlockSpan'
import PositionsOnAnnotation from './PositionsOnAnnotation'

export default class SelectionWrapper {
  constructor(spanModelContainer) {
    this.selection = window.getSelection()

    console.assert(
      this.parentOfAnchorNode.closest('.textae-editor__text-box') ===
        this.parentOfFocusNode.closest('.textae-editor__text-box'),
      'Text selection across editors is disabled'
    )

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

  get isAnchorNodeParentIsDescendantOfFocusNodeParent() {
    return this.parentOfAnchorNode.closest(`#${this.parentOfFocusNode.id}`)
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

  get parentOfAnchorNode() {
    return this.selection.anchorNode.parentElement
  }

  get parentOfFocusNode() {
    return this.selection.focusNode.parentElement
  }

  get positionsOnAnnotation() {
    return new PositionsOnAnnotation(this._spanModelContainer, this)
  }
}
