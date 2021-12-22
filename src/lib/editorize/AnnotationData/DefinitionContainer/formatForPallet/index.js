import getUrlMatches from '../../../getUrlMatches'

export default function (
  types,
  countMap,
  definedTypes,
  defaultType,
  defaultColor
) {
  return types.map((id) => ({
    id,
    label: (definedTypes.has(id) && definedTypes.get(id).label) || undefined,
    defaultType: id === defaultType,
    uri: getUrlMatches(id) ? id : undefined,
    color: (definedTypes.has(id) && definedTypes.get(id).color) || defaultColor,
    useNumber: countMap.has(id) ? countMap.get(id).usage : 0
  }))
}
