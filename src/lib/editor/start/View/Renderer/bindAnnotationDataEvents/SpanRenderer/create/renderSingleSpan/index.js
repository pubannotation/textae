import createSpanElement from './createSpanElement'
import cerateRangeToSpan from './cerateRangeToSpan'

export default function(annotationData, span) {
  const targetRange = cerateRangeToSpan(annotationData, span)
  const spanElement = createSpanElement(span)

  targetRange.surroundContents(spanElement)
}
