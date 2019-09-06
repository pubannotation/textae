import { EventEmitter } from 'events'
import uri from '../../../uri'
import createCountMap from './createCountMap'
import getDefaultTypeAutomatically from './getDefaultTypeAutomatically'
import getLabelOrColor from './getLabelOrColor'
import sortByCountAndName from './sortByCountAndName'
import createTypesWithoutInstance from './createTypesWithoutInstance'

export default class extends EventEmitter {
  constructor(getAllInstanceFunc, defaultColor, lockStateObservable) {
    super()
    this._definedTypes = new Map()
    this._getAllInstanceFunc = getAllInstanceFunc
    this._defaultColor = defaultColor
    this._lockStateObservable = lockStateObservable

    lockStateObservable(() => super.emit('type.lock'))
  }

  set definedTypes(value) {
    if (value === undefined) {
      return
    }

    // expected new value is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
    this._definedTypes = new Map(
      value.reduce((a, b) => {
        a.push([b.id, b])
        return a
      }, [])
    )

    super.emit('type.reset')

    // Set default type
    const defaultType = value.find((type) => type.default === true)
    if (defaultType) {
      delete defaultType.default
      this._defaultType = defaultType.id
    }
  }

  has(id) {
    return this._definedTypes.has(id)
  }

  get(id) {
    return Object.assign({}, this._definedTypes.get(id))
  }

  set(id, newType) {
    // Delete old ID when changing ID.
    if (id !== newType.id) {
      this._definedTypes.delete(id)
    }
    this._definedTypes.set(newType.id, newType)
    super.emit('type.change', newType.id)
  }

  addDefinedType(newType) {
    if (typeof newType.color === 'undefined') {
      const forwardMatchColor = this.getColor(newType.id)
      if (forwardMatchColor !== this._defaultColor) {
        newType.color = forwardMatchColor
      }
    }

    if (typeof newType.label === 'undefined') {
      const forwardMatchLabel = this.getLabel(newType.id)
      if (forwardMatchLabel) {
        newType.label = forwardMatchLabel
      }
    }

    this.set(newType.id, newType)
    super.emit('type.change', newType.id)
  }

  get definedTypes() {
    const types = [...this._definedTypes.values()]

    const defaultType = types.find((type) => type.id === this._defaultType)
    if (defaultType) {
      defaultType.default = true
    }

    return types
  }

  // Return the type that has the default property or the most  used type.
  get defaultType() {
    if (this._defaultType) {
      return this._defaultType
    }

    return getDefaultTypeAutomatically(this._getAllInstanceFunc())
  }

  set defaultType(id) {
    console.assert(id, 'id is necessary!')
    this._defaultType = id
    super.emit('type.default.change')
  }

  get defaultColor() {
    return this._defaultColor
  }

  getColor(id, dismissForwardMatch = false) {
    return getLabelOrColor(
      'color',
      this._definedTypes,
      id,
      this._defaultColor,
      dismissForwardMatch
    )
  }

  getLabel(id, dismissForwardMatch = false) {
    return getLabelOrColor(
      'label',
      this._definedTypes,
      id,
      undefined,
      dismissForwardMatch
    )
  }

  getUri(id) {
    return uri.getUrlMatches(id) ? id : undefined
  }

  get typeDefinition() {
    const allInstance = this._getAllInstanceFunc()
    const countMap = createCountMap(allInstance)
    const typesWithoutInstance = createTypesWithoutInstance(
      this._definedTypes.keys(),
      countMap
    )
    const types = sortByCountAndName(countMap).concat(typesWithoutInstance)

    return types.map((id) => {
      return {
        id,
        label: this.getLabel(id, true),
        defaultType: id === this.defaultType,
        uri: this.getUri(id),
        color: this.getColor(id, true),
        useNumber: countMap.get(id)
      }
    })
  }

  delete(id) {
    this._definedTypes.delete(id)
    super.emit('type.change', id)
  }

  get isLock() {
    return this._lockStateObservable()
  }
}
