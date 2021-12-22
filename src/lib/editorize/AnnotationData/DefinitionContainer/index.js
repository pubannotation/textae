import getUrlMatches from '../../getUrlMatches'
import formatForPallet from './formatForPallet'
import DefinedTypeContainer from './DefinedTypeContainer'
import sortByCountAndName from './sortByCountAndName'
import createCountMapFrom from './createCountMapFrom'
import createTypesWithoutInstance from './formatForPallet/createTypesWithoutInstance'

export default class DefinitionContainer {
  constructor(eventEmitter, annotationType, getAllInstanceFunc, defaultColor) {
    this._eventEmitter = eventEmitter
    this._annotationType = annotationType
    /** @type {DefinedTypeContainer} **/
    this._definedTypes = null
    this._getAllInstanceFunc = getAllInstanceFunc
    this._defaultColor = defaultColor
  }

  get annotationType() {
    return this._annotationType
  }

  set definedTypes(value) {
    this._definedTypes = new DefinedTypeContainer(value)

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
    const type = { ...this._definedTypes.get(id) }

    if (this._defaultType === id) {
      type.default = true
      return type
    } else {
      delete type.default
      return type
    }
  }

  replace(id, newType) {
    this._definedTypes.replace(id, newType)
    this._eventEmitter.emit(
      `textae-event.type-definition.${this._annotationType}.change`,
      newType.id
    )
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

    if (newType.default) {
      this._defaultType = newType.id
    }

    this.replace(newType.id, newType)
  }

  get definedTypes() {
    return this._definedTypes
  }

  // Return the type that has the default property or the most used type.
  get defaultType() {
    if (this._defaultType) {
      return this._defaultType
    }

    if (this._getAllInstanceFunc().length > 0) {
      return sortByCountAndName(
        createCountMapFrom(this._getAllInstanceFunc())
      )[0]
    }

    return 'something'
  }

  // The default value can be removed.
  set defaultType(id) {
    this._defaultType = id
    this._eventEmitter.emit(
      `textae-event.type-definition.${this._annotationType}.change-default`,
      id
    )
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

  findByLabel(term) {
    return this.definedTypes.labelIncludes(term)
  }

  get pallet() {
    const countMap = createCountMapFrom(this._getAllInstanceFunc())
    const typesWithoutInstance = createTypesWithoutInstance(
      this._definedTypes.ids(),
      countMap
    )
    const types = sortByCountAndName(countMap).concat(typesWithoutInstance)

    return formatForPallet(
      types,
      countMap,
      this._definedTypes,
      this.defaultType,
      this._defaultColor
    )
  }

  get config() {
    const types = this._typeMap

    // Make default type and delete defalut type from original configuratian.
    for (const [key, type] of types.entries()) {
      // Make a copy so as not to destroy the original object.
      const copy = { ...type }
      if (type.id === this.defaultType) {
        copy.default = true
      } else {
        delete copy.default
      }
      types.set(key, copy)
    }

    return [...types.values()]
  }

  get _typeMap() {
    // Get type definitions.
    // Copy map to add definitions from instance.
    const types = this._definedTypes.map

    // Get types from instances.
    for (const { typeName } of this._getAllInstanceFunc()) {
      if (!types.has(typeName)) {
        types.set(typeName, { id: typeName })
      }
    }

    return types
  }

  delete(id, defaultType) {
    this._definedTypes.delete(id)
    this._defaultType = defaultType
    this._eventEmitter.emit(
      `textae-event.type-definition.${this._annotationType}.delete`,
      id
    )
  }
}
