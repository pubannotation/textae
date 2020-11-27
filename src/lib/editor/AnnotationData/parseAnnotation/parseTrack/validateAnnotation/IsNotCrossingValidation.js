import Validation from './Validation'
import isBoundaryCrossingWithOtherSpans from '../../../isBoundaryCrossingWithOtherSpans'

export default class IsNotCrossingValidation extends Validation {
  constructor(nodes, allSpans) {
    super(
      nodes,
      (n) =>
        !isBoundaryCrossingWithOtherSpans(
          allSpans.map((s) => s.span),
          n.span.begin,
          n.span.end
        )
    )
  }
}
