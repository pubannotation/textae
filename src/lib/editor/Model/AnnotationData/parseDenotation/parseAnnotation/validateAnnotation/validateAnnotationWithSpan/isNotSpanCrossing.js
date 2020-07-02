import isBoundaryCrossingWithOtherSpans from '../../../../isBoundaryCrossingWithOtherSpans'

export default function(annotation, _, others) {
  return !isBoundaryCrossingWithOtherSpans(
    others.map((d) => d.span),
    annotation.span
  )
}
