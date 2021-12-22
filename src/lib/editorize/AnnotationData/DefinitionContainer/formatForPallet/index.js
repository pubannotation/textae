import getUrlMatches from '../../../getUrlMatches'
import createCountMapFrom from '../createCountMapFrom'
import sortByCountAndName from '../sortByCountAndName'
import createTypesWithoutInstance from './createTypesWithoutInstance'

export default function (instances, definedTypes, defaultType, defaultColor) {
  const countMap = createCountMapFrom(instances)
  const typesWithoutInstance = createTypesWithoutInstance(
    definedTypes.ids(),
    countMap
  )
  const types = sortByCountAndName(countMap).concat(typesWithoutInstance)

  return types.map((id) => ({
    id,
    label: (definedTypes.has(id) && definedTypes.get(id).label) || undefined,
    defaultType: id === defaultType,
    uri: getUrlMatches(id) ? id : undefined,
    color: (definedTypes.has(id) && definedTypes.get(id).color) || defaultColor,
    useNumber: countMap.has(id) ? countMap.get(id).usage : 0
  }))
}
