import createCountMapFrom from './createCountMapFrom'
import sortByCountAndName from './sortByCountAndName'

export default function (instances) {
  const countMap = createCountMapFrom(instances)

  if (countMap.size === 0) {
    return 'something'
  }

  return sortByCountAndName(countMap)[0]
}
