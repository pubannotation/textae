import { EventEmitter } from 'events'
import getUrlMatches from '../../../getUrlMatches'
import getDefaultTypeAutomatically from './getDefaultTypeAutomatically'
import formatForPallet from './formatForPallet'
import DefinedTypeContainer from './DefinedTypeContainer'

export default class extends EventEmitter {
  constructor(
    getAllInstanceFunc,
    lockStateObservable,
    defaultColor = '#555555'
  ) {
    super()
    this._definedTypes = null
    this._getAllInstanceFunc = getAllInstanceFunc
    this._defaultColor = defaultColor
    this._lockStateObservable = lockStateObservable

    lockStateObservable(() => super.emit('type.lock'))
  }

  set definedTypes(value = []) {
    this._definedTypes = new DefinedTypeContainer(value)

    super.emit('type.reset')

    // Set default type
    const defaultType = value.find((type) => type.default === true)
    if (defaultType) {
      delete defaultType.default
      this._defaultType = defaultType.id
    } else {
      this._defaultType = null
    }
  }

  has(id) {
    return this._definedTypes.has(id)
  }

  get(id) {
    return this._definedTypes.get(id)
  }

  set(id, newType) {
    this._definedTypes.set(id, newType)
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
    return this._definedTypes
  }

  get config() {
    // Get type definitions.
    const types = this._definedTypes.clone()

    // Get types from instances.
    for (const { type } of this._getAllInstanceFunc()) {
      if (!types.has(type.name)) {
        types.set(type.name, { id: type.name })
      }
    }

    // Make default type and delete defalut type from original configuratian.
    for (const [key, type] of types.entries()) {
      // Make a copy so as not to destroy the original object.
      const copy = Object.assign({}, type)
      if (type.id === this.defaultType) {
        copy.default = true
      } else {
        delete copy.default
      }
      types.set(key, copy)
    }

    return [...types.values()]
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

  getColor(id) {
    const config = this._definedTypes.getConfig(id)
    return (config && config.color) || this._defaultColor
  }

  getLabel(id) {
    const config = this._definedTypes.getConfig(id)
    return config && config.label
  }

  getUri(id) {
    return getUrlMatches(id) ? id : undefined
  }

  get pallet() {
    return formatForPallet(
      this._getAllInstanceFunc(),
      this._definedTypes,
      this.defaultType,
      this._defaultColor
    )
  }

  delete(id) {
    this._definedTypes.delete(id)
    super.emit('type.change', id)
  }

  get isLock() {
    return this._lockStateObservable()
  }
}
