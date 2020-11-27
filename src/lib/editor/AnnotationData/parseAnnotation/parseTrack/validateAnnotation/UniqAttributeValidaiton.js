import Validation from './Validation'

// An entity cannot have two attributes of the same predicate.
export default class UniqAttributeValidaiton extends Validation {
  constructor(spans) {
    super(spans)
  }

  _validate(currentNode, index) {
    const prevNodes = this._nodes.slice(0, index)

    return !prevNodes.some(
      (node) => node.subj === currentNode.subj && node.pred === currentNode.pred
    )
  }
}
