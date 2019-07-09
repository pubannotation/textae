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
import sortByCountAndName from './sortByCountAndName'

export default class extends EventEmitter {
  constructor(getAllInstanceFunc, defaultColor) {
    super()
    this.definedTypes = new Map()
    this.defaultType = null
    this.isSetDefaultTypeManually = false
    this.getAllInstanceFunc = getAllInstanceFunc
    this.defaultColor = defaultColor
  }

  setDefinedType(newType) {
    if (typeof newType.color === 'undefined') {
      let forwardMatchColor = this.getColor(newType.id)
      if (forwardMatchColor !== this.defaultColor) {
        newType.color = forwardMatchColor
      }
    }

    if (typeof newType.label === 'undefined') {
      let forwardMatchLabel = this.getLabel(newType.id)
      if (forwardMatchLabel) {
        newType.label = forwardMatchLabel
      }
    }

    this.definedTypes.set(newType.id, newType)
    super.emit('type.change', newType.id)
  }

  setDefinedTypes(newDefinedTypes) {
    this.definedTypes = new Map(newDefinedTypes.reduce((a, b) => {
      a.push([b.id, b])
      return a
    }, []))
  }

  getDefinedType(id) {
    return Object.assign({}, this.definedTypes.get(id))
  }

  getDefinedTypes() {
    const ret = []
    for (let id of this.definedTypes.keys()) {
      ret.push(this.definedTypes.get(id))
    }

    return ret
  }

  changeDefinedType(id, newType) {
    this.definedTypes.set(newType.id, newType)
    super.emit('type.change', newType.id)
  }

  setDefaultType(id) {
    console.assert(id, 'id is necessary!')
    this.defaultType = id
    setDefaultTypeToDefinedTypes(this.definedTypes, id)
    this.isSetDefaultTypeManually = true
  }

  countTypeUse() {
    return countTypeUse(this.getAllInstanceFunc)
  }

  getDefaultType() {
    if (!this.isSetDefaultTypeManually) {
      const id = getDefaultTypeAutomatically(this.getAllInstanceFunc)
      this.defaultType = id
      setDefaultTypeToDefinedTypes(this.definedTypes, id)
    }

    return this.defaultType
  }

  getDefaultPred() {
    return DEFAULTS.pred
  }

  getDefaultValue() {
    return DEFAULTS.value
  }

  getDefaultColor() {
    return this.defaultColor
  }

  getColor(id, dismissForwardMatch = false) {
    return getLabelOrColor('color', this.definedTypes, id, this.defaultColor, dismissForwardMatch)
  }

  getLabel(id, dismissForwardMatch = false) {
    return getLabelOrColor('label', this.definedTypes, id, undefined, dismissForwardMatch)
  }

  getUri(id) {
    return uri.getUrlMatches(id) ? id : undefined
  }

  getSortedIds() {
    const map = countTypeUse(this.getAllInstanceFunc)
    return sortByCountAndName(map)
  }

  remove(id) {
    this.definedTypes.delete(id)
    super.emit('type.change', id)
  }
}
