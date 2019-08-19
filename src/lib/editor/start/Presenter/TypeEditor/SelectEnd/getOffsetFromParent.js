export default function(node) {
  const childNodes = node.parentElement.childNodes
  let offset = 0
  for (let i = 0; childNodes[i] !== node; i++) {
    // until the focus node
    if (childNodes[i].nodeName === '#text') {
      offset += childNodes[i].nodeValue.length
    } else {
      offset += childNodes[i].textContent.length
    }
  }
  return offset
}
