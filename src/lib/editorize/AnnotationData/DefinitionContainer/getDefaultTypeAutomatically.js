import createCountMapFrom from './createCountMapFrom'

export default function (instances) {
  const countMap = createCountMapFrom(instances)

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
