import {
  EventEmitter as EventEmitter
}
from 'events'
import DEFAULTS from '../defaults'
import uri from '../../../uri'
import setDefaultTypeToDefinedTypes from './setDefaultTypeToDefinedTypes'
import countTypeUse from './countTypeUse'
import getDefaultTypeAutomatically from './getDefaultTypeAutomatically'
import getLabelOrColor from './getLabelOrColor'
import getSortedIds from './getSortedIds'

export default function(getAllInstanceFunc, defaultColor) {
  let definedTypes = new Map(),
    defaultType = null,
    isSetDefaultTypeManually = false

  const emitter = new EventEmitter(),
    api = {
      setDefinedType: (newType) => {
        if (typeof newType.color === 'undefined') {
          let forwardMatchColor = api.getColor(newType.id)
          if (forwardMatchColor !== defaultColor) {
            newType.color = forwardMatchColor
          }
        }

        if (typeof newType.label === 'undefined') {
          let forwardMatchLabel = api.getLabel(newType.id)
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
        definedTypes.set(newType.id, newType)
        emitter.emit('type.change', newType.id)
      },
      setDefaultType: (id) => {
        console.assert(id, 'id is necessary!')
        defaultType = id
        setDefaultTypeToDefinedTypes(definedTypes, id)
        isSetDefaultTypeManually = true
      },
      countTypeUse: () => countTypeUse(getAllInstanceFunc),
      getDefaultType: () => {
        if (!isSetDefaultTypeManually) {
          const id = getDefaultTypeAutomatically(getAllInstanceFunc)
          defaultType = id
          setDefaultTypeToDefinedTypes(definedTypes, id)
        }

        return defaultType
      },
      getDefaultPred: () => DEFAULTS.pred,
      getDefaultValue: () => DEFAULTS.value,
      getDefaultColor: () => defaultColor,
      getColor: (id, dismissForwardMatch = false) => getLabelOrColor('color', definedTypes, id, defaultColor, dismissForwardMatch),
      getLabel: (id, dismissForwardMatch = false) => getLabelOrColor('label', definedTypes, id, undefined, dismissForwardMatch),
      getUri: (id) => uri.getUrlMatches(id) ? id : undefined,
      getSortedIds: () => getSortedIds(countTypeUse(getAllInstanceFunc)),
      remove: (id) => {
        definedTypes.delete(id)
        emitter.emit('type.change', id)
      }
    }

  return Object.assign(emitter, api)
}
