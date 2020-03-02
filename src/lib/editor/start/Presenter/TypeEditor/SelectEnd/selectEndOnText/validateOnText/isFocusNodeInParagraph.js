import hasNodeParagraphClass from '../../hasNodeParagraphClass'

export default function(selection) {
  return hasNodeParagraphClass(selection.focusNode.parentNode)
}
