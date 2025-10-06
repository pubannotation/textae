// Get the text node at a specific offset within a root element.
// This function traverses the DOM tree to find the text node and its offset.
export default function getTextNodeAtOffset(rootElement, offset) {
  let currentOffset = 0

  function traverse(node) {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const textLength = child.textContent.length
        if (currentOffset + textLength >= offset) {
          return {
            node: child,
            offset: offset - currentOffset
          }
        }
        currentOffset += textLength
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const result = traverse(child)
        if (result) return result
      }
    }
    return null
  }

  return traverse(rootElement)
}
