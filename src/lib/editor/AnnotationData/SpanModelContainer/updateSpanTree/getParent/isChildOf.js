export default function (span, maybeParent) {
  if (!maybeParent) {
    return false
  }

  return maybeParent.begin <= span.begin && span.end <= maybeParent.end
}
