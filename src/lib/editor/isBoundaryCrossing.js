export default function (begin, end, existSpan) {
  const isStartOfCandidateSpanBetweenExistsSpan =
    existSpan.begin < begin && begin < existSpan.end && existSpan.end < end

  const isEndOfCandidateSpanBetweenExistSpan =
    begin < existSpan.begin && existSpan.begin < end && end < existSpan.end

  return (
    isStartOfCandidateSpanBetweenExistsSpan ||
    isEndOfCandidateSpanBetweenExistSpan
  )
}
