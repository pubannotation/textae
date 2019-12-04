export default function(editable, mode) {
  return editable && (mode === 'term' || mode === 'instance')
}
