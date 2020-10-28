import createSpanElement from './createSpanElement'
import createRangeToSpan from './createRangeToSpan'

export default function(span) {
  const targetRange = createRangeToSpan(span)
  const spanElement = createSpanElement(span)

  targetRange.surroundContents(spanElement)
}
