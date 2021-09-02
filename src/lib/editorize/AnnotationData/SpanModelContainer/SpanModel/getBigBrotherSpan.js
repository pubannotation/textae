// Big Brother is the Span before the span
export default function (span) {
  // The parent of a big Brother and the span is the same.
  const bros = span.parent.children
  const index = bros.indexOf(span)
  return index === 0 ? null : bros[index - 1]
}
