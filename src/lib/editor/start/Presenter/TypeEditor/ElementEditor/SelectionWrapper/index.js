import isNodeSpan from '../isNodeSpan'
import isNodeParagraph from '../isNodeParagraph'
import showAlertIfOtherParagraph from './showAlertIfOtherParagraph'
import getParagraph from './getParagraph'

export default class {
  constructor(selection) {
    this._selection = selection
  }

  get isFocusNodeInSpan() {
    return isNodeSpan(this._selection.focusNode.parentNode)
  }

  get isFocusNodeInParagraph() {
    return isNodeParagraph(this._selection.focusNode.parentNode)
  }

  get isAnchrNodeInSpanOrParagraph() {
    const node = this._selection.anchorNode.parentNode
    return isNodeSpan(node) || isNodeParagraph(node)
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
