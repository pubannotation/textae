import {
  EventEmitter as EventEmitter
}
from 'events'
import DEFAULTS from './defaults'
import uri from '../../uri'

export default function(getAllInstanceFunc, getActualTypesFunction, defaultColor, isLockFunc, lockEditFunc, unlockEditFunc) {
  let definedTypes = new Map(),
    defaultType = null,
    isSetDefaultTypeManually = false

  const emitter = new EventEmitter(),
    api = {
      isLock: isLockFunc,
      lockEdit: lockEditFunc,
      unlockEdit: unlockEditFunc,
      setDefinedType: (newType) => {
        if (typeof newType.color === 'undefined') {
          let forwardMatchColor = getColor(definedTypes, newType.id, defaultColor)
          if (forwardMatchColor !== defaultColor) {
            newType.color = forwardMatchColor
          }
        }

        if (typeof newType.label === 'undefined') {
          let forwardMatchLabel = getLabel(definedTypes, newType.id)
          if (forwardMatchLabel) {
            newType.label = forwardMatchLabel
          }
        }

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
      changeDefinedType: (id, newType) => {
        definedTypes.delete(id)
        definedTypes.set(newType.id, newType)
        emitter.emit('type.change', newType.id)
      },
      setDefaultType: (id) => {
        console.assert(id, 'id is necessary!')
        defaultType = id
        setDefaultTypeToDefinedTypes(definedTypes, id)
        isSetDefaultTypeManually = true
      },
      setDefaultTypeAutomatically: (id) => {
        defaultType = id
        setDefaultTypeToDefinedTypes(definedTypes, id)
      },
      countTypeUse: () => countTypeUse(getAllInstanceFunc),
      getDefaultType: () => isSetDefaultTypeManually ? defaultType : setAutoDefaultType(getAllInstanceFunc, api.setDefaultTypeAutomatically),
      getDefaultPred: () => DEFAULTS.pred,
      getDefaultValue: () => DEFAULTS.value,
      getDefaultColor: () => defaultColor,
      getColor: (id) => getColor(definedTypes, id, defaultColor),
      getLabel: (id) => getLabel(definedTypes, id),
      getUri: (id) => uri.getUrlMatches(id) ? id : undefined,
      getSortedIds: () => getSortedIds(getActualTypesFunction, definedTypes),
      remove: (id) => {
        definedTypes.delete(id)
        emitter.emit('type.change', id)
      }
    }

  return Object.assign(emitter, api)
}

function setDefaultTypeToDefinedTypes(definedTypes, id) {
  definedTypes.forEach((definedType) => {
    if (definedType.id === id) {
      definedType.default = true
    } else if (definedType.default) {
      delete definedType.default
    }
  })
}

function countTypeUse(getAllInstanceFunc) {
  let countMap = new Map()

  getAllInstanceFunc().forEach((instance) => {
    let type = instance.type
    if (countMap.has(type)) {
      countMap.set(type, countMap.get(type) + 1)
    } else {
      countMap.set(type, 1)
    }
  })

  return countMap
}

function setAutoDefaultType(getAllInstanceFunc, setDefaultTypeFunc) {
  let setType = null,
    countMap = countTypeUse(getAllInstanceFunc)

  if (!countMap || countMap.size === 0) {
    setType = DEFAULTS.type
  } else {
    let mapAsc = new Map([...countMap.entries()].sort()),
      max = 0

    setType = [...mapAsc.keys()][0]
    mapAsc.forEach((value, key) => {
      if (value > max) {
        max = value
        setType = key
      }
    })
  }

  setDefaultTypeFunc(setType)
  return setType
}

function getColor(definedTypes, id, defaultColor) {
  // Return color if perfectly matched
  if (definedTypes.get(id) && definedTypes.get(id).color) {
    return definedTypes.get(id).color
  }

  // Return color if forward matched
  let forwardMatchType = getForwardMatchType(definedTypes, id)
  if (forwardMatchType && forwardMatchType.color) {
    return forwardMatchType.color
  }

  return defaultColor
}

function getLabel(definedTypes, id) {
  // Return label if perfectly matched
  if (definedTypes.get(id) && definedTypes.get(id).label) {
    return definedTypes.get(id).label
  }

  // Return label if forward matched
  let forwardMatchType = getForwardMatchType(definedTypes, id)
  if (forwardMatchType && forwardMatchType.label) {
    return forwardMatchType.label
  }

  return undefined
}

function getForwardMatchType(definedTypes, id) {
  // '*' at the last char of id means wildcard.
  let forwardMatchTypes = []
  definedTypes.forEach((definedType) => {
    if (definedType.id.indexOf('*') !== -1 && id.indexOf(definedType.id.slice(0, -1)) === 0) {
      forwardMatchTypes.push(definedType)
    }
  })

  // If some wildcard-id are matched, return the type of the most longest matched.
  if (forwardMatchTypes.length >= 1) {
    return forwardMatchTypes.reduce((longestType, forwardMatchType) => {
      return forwardMatchType.id.length > longestType.id.length ? forwardMatchType : longestType
    }, {id: ''})
  }

  return null
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
        a < b ? -1 :
        0
    })

    return typeNames
  }

  return []
}
