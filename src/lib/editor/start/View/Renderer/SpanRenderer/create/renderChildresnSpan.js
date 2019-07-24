export default function(span, create) {
  for (const child of span.children) {
    create(child)
  }

  return span
}
