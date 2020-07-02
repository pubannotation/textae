export default function(candidateSpan, existSpan) {
  const isStartOfCandidateSpanBetweenExistsSpan =
    existSpan.begin < candidateSpan.begin &&
    candidateSpan.begin < existSpan.end &&
    existSpan.end < candidateSpan.end

  const isEndOfCandidateSpanBetweenExistSpan =
    candidateSpan.begin < existSpan.begin &&
    existSpan.begin < candidateSpan.end &&
    candidateSpan.end < existSpan.end

  return (
    isStartOfCandidateSpanBetweenExistsSpan ||
    isEndOfCandidateSpanBetweenExistSpan
  )
}
