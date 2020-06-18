import hasNodeSpanClass from './hasNodeSpanClass'
import hasNodeParagraphClass from './hasNodeParagraphClass'
import showAlertIfOtherParagraph from './showAlertIfOtherParagraph'
import getParagraph from './getParagraph'

export default class {
  constructor(selection) {
    this._selection = selection
  }

  isFocusNodeInSpan() {
    return hasNodeSpanClass(this._selection.focusNode.parentNode)
  }

  isFocusNodeInParagraph() {
    return hasNodeParagraphClass(this._selection.focusNode.parentNode)
  }

  isAnchrNodeInSpanOrParagraph() {
    const node = this._selection.anchorNode.parentNode
    return hasNodeSpanClass(node) || hasNodeParagraphClass(node)
  }

  showAlertIfOtherParagraph() {
    if (this._selection.type === 'Range') {
      showAlertIfOtherParagraph(this._isInSameParagraph())
    }
  }

  _isInSameParagraph() {
    const anchorParagraph = getParagraph(this._selection.anchorNode)
    const focusParagraph = getParagraph(this._selection.focusNode)

    return anchorParagraph === focusParagraph
  }
}
