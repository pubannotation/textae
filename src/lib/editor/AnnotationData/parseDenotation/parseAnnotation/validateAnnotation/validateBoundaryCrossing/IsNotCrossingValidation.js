import Validation from '../Validation'
import isBoundaryCrossingWithOtherSpans from '../../../../isBoundaryCrossingWithOtherSpans'

export default class extends Validation {
  constructor(spans) {
    super(spans)
  }

  _validate(currentNode, index) {
    const prevNodes = this._nodes.slice(0, index)

    return !isBoundaryCrossingWithOtherSpans(
      prevNodes.map((d) => d.span),
      currentNode.span
    )
  }
}
