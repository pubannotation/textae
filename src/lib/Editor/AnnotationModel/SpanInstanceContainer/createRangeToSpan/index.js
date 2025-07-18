import createRange from './createRange'
import getRenderingPosition from './getRenderingPosition'

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
export default function createRangeToSpan(span) {
  const { textNode, start, end } = getRenderingPosition(span)

  return createRange(textNode, start, end)
}
