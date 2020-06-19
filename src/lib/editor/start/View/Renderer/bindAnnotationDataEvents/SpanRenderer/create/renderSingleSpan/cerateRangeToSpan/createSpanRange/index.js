import createRange from './createRange'
import getOffset from './getOffset'
import validateOffset from './validateOffset'

export default function(textNode, startOfTextNode, span) {
  const offset = getOffset(span, startOfTextNode)

  if (!validateOffset(textNode, offset)) {
    throw new Error(
      `oh my god! I cannot render this span. ${span.id}, textNode ${textNode.textContent}`
    )
  }

  return createRange(textNode, offset)
}
