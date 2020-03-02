import hasNodeSpanClass from '../../hasNodeSpanClass'

export default function(selection) {
  return hasNodeSpanClass(selection.focusNode.parentNode)
}
