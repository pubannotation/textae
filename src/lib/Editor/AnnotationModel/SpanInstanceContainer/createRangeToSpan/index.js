import getRenderingPosition from './getRenderingPosition'

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
export default function (span) {
  const { begin, end: originalEnd, parent, bigBrother } = span
  const { textNode, start, end } = getRenderingPosition(
    begin,
    originalEnd,
    parent,
    bigBrother
  )

  if (!textNode) {
    throw new Error(
      `The textNode on to create a span ${begin}:${originalEnd} is not found. `
    )
  }

  if (start < 0) {
    throw new Error(
      `start must be positive, but ${start} for ${begin}:${originalEnd}.`
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

  const range = document.createRange()
  range.setStart(textNode, start)
  range.setEnd(textNode, end)
  return range
}
