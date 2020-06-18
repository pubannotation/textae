export default function(textNode, offset) {
  const range = document.createRange()

  range.setStart(textNode, offset.start)
  range.setEnd(textNode, offset.end)

  return range
}
