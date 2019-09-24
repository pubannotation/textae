import getUrlMatches from '../../../../getUrlMatches'
import createCountMap from '../createCountMap'
import getLabelOrColor from '../getLabelOrColor'
import sortByCountAndName from './sortByCountAndName'
import createTypesWithoutInstance from './createTypesWithoutInstance'

export default function(instances, definedTypes, defaultType, defaultColor) {
  const countMap = createCountMap(instances)
  const typesWithoutInstance = createTypesWithoutInstance(
    definedTypes.keys(),
    countMap
  )
  const types = sortByCountAndName(countMap).concat(typesWithoutInstance)
  return types.map((id) => {
    return {
      id,
      label: getLabelOrColor('label', definedTypes, id, undefined, true),
      defaultType: id === defaultType,
      uri: getUrlMatches(id) ? id : undefined,
      color: getLabelOrColor('color', definedTypes, id, defaultColor, true),
      useNumber: countMap.get(id)
    }
  })
}
