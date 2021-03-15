import spanComparator from './spanComparator'

export default function (container, firstId, secondId) {
  let first = container.get(firstId)
  let second = container.get(secondId)

  // switch if seconfId before firstId
  if (spanComparator(first, second) > 0) {
    const temp = first
    first = second
    second = temp
  }

  return [...container.values()]
    .filter(
      (span) =>
        first.begin <= span.begin &&
        (span.end <= first.end || span.end <= second.end)
    )
    .map((span) => span.id)
}
