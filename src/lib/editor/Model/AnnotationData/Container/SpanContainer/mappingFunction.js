import isBoundaryCrossingWithOtherSpans from '../../../../isBoundaryCrossingWithOtherSpans'
import SpanModel from './SpanModel'

export default function(denotations, editor, paragraph, entityContainer) {
  denotations = denotations || []

  return denotations
    .map((entity) => entity.span)
    .map((span) => new SpanModel(editor, paragraph, span, entityContainer))
    .filter(
      (span, index, array) =>
        !isBoundaryCrossingWithOtherSpans(array.slice(0, index - 1), span)
    )
}
