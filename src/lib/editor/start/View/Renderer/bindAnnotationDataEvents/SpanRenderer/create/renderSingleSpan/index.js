import createSpanElement from './createSpanElement'
import cerateRangeToSpan from './cerateRangeToSpan'

export default function(editor, span) {
  const targetRange = cerateRangeToSpan(editor, span)
  const spanElement = createSpanElement(span)

  targetRange.surroundContents(spanElement)
}
