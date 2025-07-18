export default function createRange(textNode, end, start) {
  if (textNode.length < end) {
    throw new Error(
      `oh my god! I cannot render span. "${textNode.textContent.slice(
        start,
        end
      )}" at ${start}~${end} of text(${textNode.textContent.length}) as "${textNode.textContent}".`
    )
  }

  const range = document.createRange()
  range.setStart(textNode, start)
  range.setEnd(textNode, end)
  return range
}
