import isNotSpanCrossing from './isNotSpanCrossing'
import Validation from '../../Validation'

export default class extends Validation {
  constructor(spans) {
    super(spans)
  }

  _validate(currentNode, index) {
    const prevNodes = this._nodes.slice(0, index)

    return isNotSpanCrossing(currentNode, prevNodes)
  }
}
