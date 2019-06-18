export default function(parent, span) {
  parent.children.push(span)
  span.parent = parent
}
