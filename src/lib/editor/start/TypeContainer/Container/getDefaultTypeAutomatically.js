import countTypeUse from './createCountMap'

export default function(instances) {
  const countMap = countTypeUse(instances)

  if (!countMap || countMap.size === 0) {
    return 'something'
  } else {
    const countMapEntries = [...countMap.entries()].sort()

    const {mostCommonlyUsedType} = countMapEntries.reduce(({max, mostCommonlyUsedType}, [type, useCount]) => {
      if (useCount > max) {
        max = useCount
        mostCommonlyUsedType = type
      }

      return {max, mostCommonlyUsedType}
    }, {max: 0, mostCommonlyUsedType: [countMapEntries][0]})

    return mostCommonlyUsedType
  }
}
