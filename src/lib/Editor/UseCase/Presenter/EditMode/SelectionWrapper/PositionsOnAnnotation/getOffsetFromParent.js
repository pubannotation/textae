export default function (node) {
  let offset = 0

  for (const prevNode of node.parentElement.childNodes) {
    // until the focus node
    if (prevNode == node) {
      break
    }

    if (prevNode.nodeName === '#text') {
      offset += prevNode.nodeValue.length
    } else {
      offset += prevNode.textContent.length
    }
  }

  return offset
}
