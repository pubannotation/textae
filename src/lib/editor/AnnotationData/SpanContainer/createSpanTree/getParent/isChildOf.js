export default function(spanContainer, span, maybeParent) {
  if (!maybeParent) {
    return false
  }

  if (!spanContainer.get(maybeParent.id)) {
    throw new Error(
      `maybeParent is removed. { begin: ${maybeParent.begin}, end: ${maybeParent.end} }`
    )
  }

  return maybeParent.begin <= span.begin && span.end <= maybeParent.end
}
