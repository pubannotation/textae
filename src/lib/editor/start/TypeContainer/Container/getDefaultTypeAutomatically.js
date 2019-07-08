import DEFAULTS from '../defaults'
import countTypeUse from './countTypeUse'

export default function(getAllInstanceFunc) {
  const countMap = countTypeUse(getAllInstanceFunc)

  if (!countMap || countMap.size === 0) {
    return DEFAULTS.type
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
