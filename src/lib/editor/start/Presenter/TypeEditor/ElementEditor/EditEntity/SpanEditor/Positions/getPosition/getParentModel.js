import hasNodeParagraphClass from '../../../../hasNodeParagraphClass'
import hasNodeSpanClass from '../../../../hasNodeSpanClass'

export default function(paragraph, span, node) {
  const parent = node.parentElement
  if (hasNodeParagraphClass(parent)) {
    return paragraph.get(parent.id)
  }
  if (hasNodeSpanClass(parent)) {
    return span.get(parent.id)
  }
  throw new Error(`Can not get position of a node : ${node} ${node.data}`)
}
