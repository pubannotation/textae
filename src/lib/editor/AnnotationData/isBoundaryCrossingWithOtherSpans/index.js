import isBoundaryCrossing from './isBoundaryCrossing'

// A span its range is coross over with other spans are not able to rendered.
// Because spans are renderd with span tag. Html tags can not be cross over.
export default function(spans, candidateSpan) {
  return (
    spans.filter((existSpan) =>
      isBoundaryCrossing(candidateSpan.begin, candidateSpan.end, existSpan)
    ).length > 0
  )
}
