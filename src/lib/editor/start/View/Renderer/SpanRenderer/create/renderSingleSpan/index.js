import createSpanElement from './createSpanElement'
import cerateRangeToSpan from './cerateRangeToSpan'

export default function(span, bigBrother) {
  const targetRange = cerateRangeToSpan(span, bigBrother)
  const spanElement = createSpanElement(span)

  targetRange.surroundContents(spanElement)
}
