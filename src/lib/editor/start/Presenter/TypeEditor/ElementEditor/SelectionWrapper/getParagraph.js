export default function(node) {
  console.assert(node, 'node is necessary')
  return node.parentElement.closest('.textae-editor__body__text-box__paragraph')
}
