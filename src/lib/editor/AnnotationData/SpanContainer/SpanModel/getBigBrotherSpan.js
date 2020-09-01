// Big Brother is the Span before the span
export default function(span, topLevelSpans) {
  // The parent of a big Brother and the span is the same.
  const bros = span.parent ? span.parent.children : topLevelSpans
  const index = bros.indexOf(span)
  return index === 0 ? null : bros[index - 1]
}
