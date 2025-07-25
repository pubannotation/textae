import getTextNodeAtOffset from './getTextNodeAtOffset'

// This function updates the selection in the document based on the provided offsets.
export default function updateSelection(selection, rootElement, begin, end) {
  const startNode = getTextNodeAtOffset(rootElement, begin)
  const endNode = getTextNodeAtOffset(rootElement, end)

  const range = document.createRange()
  range.setStart(startNode.node, startNode.offset)
  range.setEnd(endNode.node, endNode.offset)

  selection.removeAllRanges()
  selection.addRange(range)
}
