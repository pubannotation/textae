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
