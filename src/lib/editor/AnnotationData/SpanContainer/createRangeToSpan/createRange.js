export default function (textNode, start, end) {
  const range = document.createRange()

  range.setStart(textNode, start)
  range.setEnd(textNode, end)

  return range
}
