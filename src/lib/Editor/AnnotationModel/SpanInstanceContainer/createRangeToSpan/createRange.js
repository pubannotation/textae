export default function createRange(textNode, start, end) {
  const range = document.createRange()

  range.setStart(textNode, start)
  range.setEnd(textNode, end)

  return range
}
