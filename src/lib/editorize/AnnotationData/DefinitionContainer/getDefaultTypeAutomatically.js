import createCountMapFrom from './createCountMapFrom'
import sortByCountAndName from './sortByCountAndName'

export default function (instances) {
  if (instances.length === 0) {
    return 'something'
  }

  return sortByCountAndName(createCountMapFrom(instances))[0]
}
