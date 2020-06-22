import isBoundaryCrossingWithOtherSpans from '../../../../../../isBoundaryCrossingWithOtherSpans'

export default function(denotation, _, others) {
  return !isBoundaryCrossingWithOtherSpans(
    others.map((d) => d.span),
    denotation.span
  )
}
