import createSpanElement from './createSpanElement'
import createRangeToSpan from './createRangeToSpan'

export default function(editor, span) {
  const targetRange = createRangeToSpan(editor, span)
  const spanElement = createSpanElement(span)

  targetRange.surroundContents(spanElement)
}
