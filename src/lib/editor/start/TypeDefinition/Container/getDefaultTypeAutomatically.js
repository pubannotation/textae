import createCountMap from './createCountMap'

export default function (instances) {
  const countMap = createCountMap(instances)

  if (countMap.size === 0) {
    return 'something'
  }

  const countMapEntries = [...countMap.entries()].sort()

  const { mostCommonlyUsedType } = countMapEntries.reduce(
    ({ max, mostCommonlyUsedType }, [type, useCount]) => {
      if (useCount > max) {
        max = useCount
        mostCommonlyUsedType = type
      }

      return { max, mostCommonlyUsedType }
    },
    { max: 0, mostCommonlyUsedType: [countMapEntries][0] }
  )

  return mostCommonlyUsedType
}
