export default function (spans, node) {
  // Span without ID is acceptable.
  return (
    node.id === undefined ||
    spans.filter((d) => node.id && node.id === d.id).length === 1
  )
}
