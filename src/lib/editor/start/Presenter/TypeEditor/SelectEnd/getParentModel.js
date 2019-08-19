export default function(paragraph, span, node) {
  const parent = node.parentElement
  if (parent.classList.contains('textae-editor__body__text-box__paragraph')) {
    return paragraph.get(parent.id)
  }
  if (parent.classList.contains('textae-editor__span')) {
    return span.get(parent.id)
  }
  throw new Error(`Can not get position of a node : ${node} ${node.data}`)
}
