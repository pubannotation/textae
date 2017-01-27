import {
  EventEmitter as EventEmitter
}
from 'events'
import DEFAULT_TYPE from './defaultType'
import uri from '../../uri'

export default function(getActualTypesFunction, defaultColor) {
  let definedTypes = new Map(),
    defaultType = DEFAULT_TYPE

  const emitter = new EventEmitter(),
    api = {
      setDefinedType: (newType) => {
        definedTypes.set(newType.id, newType)
        emitter.emit('type.change', newType.id)
      },
      setDefinedTypes: (newDefinedTypes) => definedTypes = new Map(newDefinedTypes.reduce((a, b) => {
        a.push([b.id, b])
        return a
      }, [])),
      getDefinedType: (id) => Object.assign({}, definedTypes.get(id)),
      getDefinedTypes: () => {
        const ret = []
        for (let id of definedTypes.keys()) {
          ret.push(definedTypes.get(id))
        }

        return ret
      },
      setDefaultType: (id) => {
        console.assert(id, 'id is necessary!')
        defaultType = id
      },
      getDefaultType: () => defaultType || getSortedIds()[0],
      getColor: (id) => definedTypes.get(id) && definedTypes.get(id).color || defaultColor,
      getLabel: (id) => definedTypes.get(id) && definedTypes.get(id).label || undefined,
      getUri: (id) => uri.getUrlMatches(id) ? id : undefined,
      getSortedIds: () => getSortedIds(getActualTypesFunction, definedTypes),
      remove: (id) => {
        definedTypes.delete(id)
        emitter.emit('type.change', id)
      }
    }

  return Object.assign(emitter, api)
}

function getSortedIds(getActualTypesFunction, definedTypes) {
  if (getActualTypesFunction) {
    const typeCount = getActualTypesFunction()
      .concat(Array.from(definedTypes.keys()))
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
