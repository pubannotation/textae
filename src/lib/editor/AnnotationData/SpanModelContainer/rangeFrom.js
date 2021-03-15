import spanComparator from './spanComparator'

export default function (container, firstId, secondId) {
  const first = container.get(firstId)
  const second = container.get(secondId)
  let left = first
  let right = second

  // switch if seconfId before firstId
  if (spanComparator(first, second) > 0) {
    left = second
    right = first
  }

  return [...container.values()]
    .filter(
      (span) =>
        left.begin <= span.begin &&
        (span.end <= left.end || span.end <= right.end)
    )
    .map((span) => span.id)
}
