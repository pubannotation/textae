import isBoundaryCrossingWithOtherSpans from '../../../isBoundaryCrossingWithOtherSpans'
import SpanModel from './SpanModel'

export default function(denotations, editor, entityContainer) {
  denotations = denotations || []

  return denotations
    .map((entity) => entity.span)
    .map((span) => new SpanModel(editor, span, entityContainer))
    .filter(
      (span, index, array) =>
        !isBoundaryCrossingWithOtherSpans(array.slice(0, index - 1), span)
    )
}
