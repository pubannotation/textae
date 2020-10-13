import getRenderingPosition from './getRenderingPosition'
import validateRenderingPosition from './validateRenderingPosition'
import createRange from './createRange'

// Get the Range to that new span tag insert.
// This function works well when no child span is rendered.
export default function(span) {
  const { textNode, start, end } = getRenderingPosition(span)

  if (!textNode) {
    throw new Error(`The textNode on to create a span is not found. ${span.id}`)
  }

  if (!validateRenderingPosition(textNode, start, end)) {
    throw new Error(
      `oh my god! I cannot render ${span.id}. "${textNode.textContent.slice(
        start,
        end
      )}" at ${start}~${end} of text(${textNode.textContent.length}) as "${
        textNode.textContent
      }".`
    )
  }

  return createRange(textNode, start, end)
}
