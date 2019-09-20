import { EventEmitter } from 'events'
import getUrlMatches from '../../../getUrlMatches'
import getDefaultTypeAutomatically from './getDefaultTypeAutomatically'
import getLabelOrColor from './getLabelOrColor'
import formatForPallet from './formatForPallet'

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
    return this._definedTypes
  }

  get config() {
    // Get type definitions.
    const types = new Map(this._definedTypes)

    // Get types from instances.
    for (const { type } of this._getAllInstanceFunc()) {
      if (!types.has(type.name)) {
        types.set(type.name, { id: type.name })
      }
    }

    // Make default type and delete defalut type from original configuratian.
    for (const type of types.values()) {
      if (type.id === this.defaultType) {
        type.default = true
      } else {
        delete type.default
      }
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
