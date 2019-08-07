import { EventEmitter } from 'events'
import uri from '../../../uri'
import setDefaultTypeToDefinedTypes from './setDefaultTypeToDefinedTypes'
import createCountMap from './createCountMap'
import getDefaultTypeAutomatically from './getDefaultTypeAutomatically'
import getLabelOrColor from './getLabelOrColor'
import sortByCountAndName from './sortByCountAndName'
import createTypesWithoutInstance from './createTypesWithoutInstance'

export default class extends EventEmitter {
  constructor(getAllInstanceFunc, defaultColor, lockStateObservable) {
    super()
    this.definedTypes = new Map()
    this.getAllInstanceFunc = getAllInstanceFunc
    this.defaultColor = defaultColor
    this.lockStateObservable = lockStateObservable

    lockStateObservable(() => super.emit('type.lock'))
  }

  setDefinedType(newType) {
    if (typeof newType.color === 'undefined') {
      const forwardMatchColor = this.getColor(newType.id)
      if (forwardMatchColor !== this.defaultColor) {
        newType.color = forwardMatchColor
      }
    }

    if (typeof newType.label === 'undefined') {
      const forwardMatchLabel = this.getLabel(newType.id)
      if (forwardMatchLabel) {
        newType.label = forwardMatchLabel
      }
    }

    this.definedTypes.set(newType.id, newType)
    super.emit('type.change', newType.id)
  }

  setDefinedTypes(newDefinedTypes) {
    this.definedTypes = new Map(
      newDefinedTypes.reduce((a, b) => {
        a.push([b.id, b])
        return a
      }, [])
    )
  }

  has(id) {
    return this.definedTypes.has(id)
  }

  getDefinedType(id) {
    return Object.assign({}, this.definedTypes.get(id))
  }

  getDefinedTypes() {
    const ret = []
    for (const id of this.definedTypes.keys()) {
      ret.push(this.definedTypes.get(id))
    }

    return ret
  }

  changeDefinedType(id, newType) {
    // Delete old ID when changing ID.
    if (id !== newType.id) {
      this.definedTypes.delete(id)
    }
    this.definedTypes.set(newType.id, newType)
    super.emit('type.change', newType.id)
  }

  setDefaultType(id) {
    console.assert(id, 'id is necessary!')
    setDefaultTypeToDefinedTypes(this.definedTypes, id)
  }

  // Return the type that has the default property or the most  used type.
  getDefaultType() {
    for (const type of this.definedTypes.values()) {
      if (type.default) {
        return type.id
      }
    }

    return getDefaultTypeAutomatically(this.getAllInstanceFunc())
  }

  getDefaultColor() {
    return this.defaultColor
  }

  getColor(id, dismissForwardMatch = false) {
    return getLabelOrColor(
      'color',
      this.definedTypes,
      id,
      this.defaultColor,
      dismissForwardMatch
    )
  }

  getLabel(id, dismissForwardMatch = false) {
    return getLabelOrColor(
      'label',
      this.definedTypes,
      id,
      undefined,
      dismissForwardMatch
    )
  }

  getUri(id) {
    return uri.getUrlMatches(id) ? id : undefined
  }

  get typeDefinition() {
    const allInstance = this.getAllInstanceFunc()
    const countMap = createCountMap(allInstance)
    const typesWithoutInstance = createTypesWithoutInstance(
      this.definedTypes.keys(),
      countMap
    )
    const types = sortByCountAndName(countMap).concat(typesWithoutInstance)

    return types.map((id) => {
      return {
        id,
        label: this.getLabel(id, true),
        defaultType: id === this.getDefaultType(),
        uri: this.getUri(id),
        color: this.getColor(id, true),
        useNumber: countMap.get(id)
      }
    })
  }

  remove(id) {
    this.definedTypes.delete(id)
    super.emit('type.change', id)
  }

  get isLock() {
    return this.lockStateObservable()
  }
}
