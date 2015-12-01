import DEFAULT_TYPE from './defaultType'
import uri from '../uri'

export default function(getActualTypesFunction, defaultColor) {
  let definedTypes = {},
    defaultType = DEFAULT_TYPE

  return {
    setDefinedTypes: (newDefinedTypes) => definedTypes = newDefinedTypes,
    getDeinedType: (type) => Object.assign({}, definedTypes[type]),
    setDefaultType: (id) => {
      console.assert(id, 'id is necessary!')
      defaultType = id
    },
    getDefaultType: () => defaultType || getSortedIds()[0],
    getColor: (name) => definedTypes[name] && definedTypes[name].color || defaultColor,
    getLabel: (name) => definedTypes[name] && definedTypes[name].label || undefined,
    getUri: (name) => uri.getUrlMatches(name) ? name : undefined,
    getSortedIds: () => getSortedIds(getActualTypesFunction, definedTypes)
  }
}

function getSortedIds(getActualTypesFunction, definedTypes) {
  if (getActualTypesFunction) {
    const typeCount = getActualTypesFunction()
      .concat(Object.keys(definedTypes))
      .reduce(function(a, b) {
        a[b] = a[b] ? a[b] + 1 : 1
        return a
      }, {})

    // Sort by number of types, and by name if numbers are same.
    const typeNames = Object.keys(typeCount)

    typeNames.sort(function(a, b) {
      const diff = typeCount[b] - typeCount[a]

      return diff !== 0 ? diff :
        a > b ? 1 :
        b < a ? -1 :
        0
    })

    return typeNames
  }

  return []
}
