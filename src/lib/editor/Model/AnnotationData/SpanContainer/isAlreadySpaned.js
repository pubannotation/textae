export default function(allSpans, candidateSpan) {
  return (
    allSpans.filter((existSpan) => {
      return (
        existSpan.begin === candidateSpan.begin &&
        existSpan.end === candidateSpan.end
      )
    }).length > 0
  )
}
