import dohtml from 'dohtml'

import getTextNodeAtOffset from './getTextNodeAtOffset'

// This function updates the selection in the document based on the provided offsets.
export default function markSelection(rootElement, begin, end) {
  const startNode = getTextNodeAtOffset(rootElement, begin)
  const endNode = getTextNodeAtOffset(rootElement, end)

  const range = document.createRange()
  range.setStart(startNode.node, startNode.offset)
  range.setEnd(endNode.node, endNode.offset)

  const content = range.extractContents()
  const mark = dohtml.create('<mark></mark>')
  mark.appendChild(content)
  range.insertNode(mark)
}
