import createSpanElement from './createSpanElement'
import cerateRangeToSpan from './cerateRangeToSpan'

export default function(editor, annotationData, span) {
  const targetRange = cerateRangeToSpan(editor, annotationData, span)
  const spanElement = createSpanElement(span)

  targetRange.surroundContents(spanElement)
}
