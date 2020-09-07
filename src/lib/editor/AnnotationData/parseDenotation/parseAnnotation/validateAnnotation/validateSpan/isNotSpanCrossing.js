import isBoundaryCrossingWithOtherSpans from '../../../../isBoundaryCrossingWithOtherSpans'

export default function(annotation, others) {
  return !isBoundaryCrossingWithOtherSpans(
    others.map((d) => d.span),
    annotation.span
  )
}
