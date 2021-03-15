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

  return [...spanModelContainer.values()]
    .filter(
      (span) =>
        left.begin <= span.begin &&
        (span.end <= left.end || span.end <= right.end)
    )
    .map((span) => span.id)
}
