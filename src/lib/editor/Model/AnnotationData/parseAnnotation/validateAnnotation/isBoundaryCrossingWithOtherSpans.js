// A span its range is coross over with other spans are not able to rendered.
// Because spans are renderd with span tag. Html tags can not be cross over.
export default function(spans, candidateSpan) {
  return spans
    .filter(existSpan => isBoundaryCrossing(candidateSpan, existSpan))
    .length > 0
}

function isBoundaryCrossing(candidateSpan, existSpan) {
  let isStartOfCandidateSpanBetweenExistsSpan = existSpan.begin < candidateSpan.begin &&
    candidateSpan.begin < existSpan.end &&
    existSpan.end < candidateSpan.end,
    isEndOfCandidateSpanBetweenExistSpan = candidateSpan.begin < existSpan.begin &&
    existSpan.begin < candidateSpan.end &&
    candidateSpan.end < existSpan.end


  return isStartOfCandidateSpanBetweenExistsSpan || isEndOfCandidateSpanBetweenExistSpan
}
