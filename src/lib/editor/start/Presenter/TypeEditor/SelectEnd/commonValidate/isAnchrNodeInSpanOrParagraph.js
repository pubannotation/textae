import hasNodeSpanClass from '../hasNodeSpanClass'
import hasNodeParagraphClass from '../hasNodeParagraphClass'

export default function(selection) {
  const node = selection.anchorNode.parentNode
  return hasNodeSpanClass(node) || hasNodeParagraphClass(node)
}
