import spanComparator from './spanComparator'

export default function (spanModelContainer, firstId, secondId) {
  const first = spanModelContainer.get(firstId)
  const second = spanModelContainer.get(secondId)
  let left = first
  let right = second

  // switch if seconfId before firstId
  if (spanComparator(first, second) > 0) {
    left = second
    right = first
  }

  // When the parent-child span is selected, the child span will be on the right.
  // In this case, the end of the child span is to the left of the end of the parent span.
  return [...spanModelContainer.values()]
    .filter(
      (span) =>
        left.begin <= span.begin &&
        (span.end <= left.end || span.end <= right.end)
    )
    .map((span) => span.id)
}
