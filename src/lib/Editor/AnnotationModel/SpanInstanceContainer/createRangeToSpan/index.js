import getRenderingPosition from './getRenderingPosition'
import createRange from './createRange'

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
export default function (span) {
  const { textNode, start, end } = getRenderingPosition(span, span.bigBrother)

  if (!textNode) {
    throw new Error(
      `The textNode on to create a span ${span.begin}:${span.end} is not found. `
    )
  }

  if (start < 0) {
    throw new Error(
      `start must be positive, but ${start} for ${span.begin}:${span.end}.`
    )
  }

  if (textNode.length < end) {
    throw new Error(
      `oh my god! I cannot render span. "${textNode.textContent.slice(
        start,
        end
      )}" at ${start}~${end} of text(${textNode.textContent.length}) as "${
        textNode.textContent
      }".`
    )
  }

  return createRange(textNode, start, end)
}
