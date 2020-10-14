import isBoundaryCrossing from './isBoundaryCrossing'

// A span its range is coross over with other spans are not able to rendered.
// Because spans are renderd with span tag. Html tags can not be cross over.
export default function(spans, begin, end) {
  return (
    spans.filter((existSpan) => isBoundaryCrossing(begin, end, existSpan))
      .length > 0
  )
}
