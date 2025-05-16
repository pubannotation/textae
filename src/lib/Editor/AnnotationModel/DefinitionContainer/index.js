import getUrlMatches from '../../getUrlMatches'
import formatForPallet from './formatForPallet'
import sortByCountAndName from './sortByCountAndName'
import countUsage from './countUsage'
import DefinedType from '../DefinedType'
import DefinedTypeContainer from './DefinedTypeContainer'

export default class DefinitionContainer {
  #eventEmitter
  #annotationType
  /** @type {import('./DefinedTypeContainer').default} **/
  #definedTypes = new DefinedTypeContainer([])
  #getAllInstanceFunc
  #defaultColor
  #defaultType
  #autocompletionWs = ''
  #autocompletionFunction

  constructor(eventEmitter, annotationType, getAllInstanceFunc, defaultColor) {
    this.#eventEmitter = eventEmitter
    this.#annotationType = annotationType
    this.#getAllInstanceFunc = getAllInstanceFunc
    this.#defaultColor = defaultColor
  }

  set autocompletionWs(value) {
    this.#autocompletionWs = value
  }

  set autocompletionFunction(fn) {
    this.#autocompletionFunction = fn
  }

  get autocompletionWs() {
    return this.#autocompletionWs
  }

  get annotationType() {
    return this.#annotationType
  }

  get config() {
    const types = this.#typeMap

    // Make default type and delete default type from original configuration.
    for (const [key, type] of types.entries()) {
      // Make a copy so as not to destroy the original object.
      const copy = type.toJSON()
      if (type.id === this.defaultType) {
        copy.default = true
      } else {
        delete copy.default
      }
      types.set(key, copy)
    }

    return [...types.values()]
  }

  set config(values) {
    this.#definedTypes = new DefinedTypeContainer(values)

    // Set default type
    const defaultType = this.#definedTypes.default
    if (defaultType) {
      delete defaultType.default
      this.#defaultType = defaultType.id
    } else {
      this.#defaultType = null
    }
  }

  has(id) {
    return this.#definedTypes.has(id)
  }

  get(id) {
    const type = { ...this.#definedTypes.map.get(id) }

    if (this.#defaultType === id) {
      type.default = true
      return type
    } else {
      delete type.default
      return type
    }
  }

  replace(id, newType) {
    this.#definedTypes.replace(id, newType)
    this.#eventEmitter.emit(
      `textae-event.type-definition.${this.#annotationType}.change`,
      newType.id
    )
  }

  addDefinedType(newType) {
    if (typeof newType.color === 'undefined') {
      const forwardMatchColor = this.getColor(newType.id)
      if (forwardMatchColor !== this.#defaultColor) {
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
      this.#defaultType = newType.id
    }

    this.replace(newType.id, newType)
  }

  // Return the type that has the default property or the most used type.
  get defaultType() {
    if (this.#defaultType) {
      return this.#defaultType
    }

    if (this.#getAllInstanceFunc().length > 0) {
      return sortByCountAndName(
        countUsage(this.#typeMap, this.#getAllInstanceFunc())
      )[0]
    }

    return 'something'
  }

  // The default value can be removed.
  set defaultType(id) {
    this.#defaultType = id
    this.#eventEmitter.emit(
      `textae-event.type-definition.${this.#annotationType}.change-default`,
      id
    )
  }

  get defaultColor() {
    return this.#defaultColor
  }

  getColor(id) {
    return this.#definedTypes.getColorOf(id) || this.#defaultColor
  }

  getLabel(id) {
    return this.#definedTypes.getLabelOf(id)
  }

  getURI(id) {
    return getUrlMatches(id) ? id : undefined
  }

  searchByLabel(term, done) {
    if (
      !this.#autocompletionWs &&
      typeof this.#autocompletionFunction !== 'function'
    ) {
      done(this.findByLabel(term))
      return
    }

    if (typeof this.#autocompletionFunction === 'function') {
      const result = this.#autocompletionFunction(term)
      const merged = this.mergeWithLocalData(result, term)
      done(merged)
      return
    }

    const url = new URL(this.#autocompletionWs, location)
    url.searchParams.append('term', term)

    fetch(url.href)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data) => {
        const merged = this.mergeWithLocalData(data, term)
        done(merged)
      })
  }

  findByLabel(term) {
    return this.#definedTypes.labelsIncludes(term)
  }

  mergeWithLocalData(externalData, term) {
    const localData = this.findByLabel(term)
    const filteredData = (externalData || []).filter(
      (newDatum) =>
        !localData.some((localDatum) => newDatum.id === localDatum.id)
    )
    return localData.concat(filteredData)
  }

  get pallet() {
    const countMap = countUsage(this.#typeMap, this.#getAllInstanceFunc())
    const types = sortByCountAndName(countMap)

    return formatForPallet(
      types,
      countMap,
      this.#definedTypes,
      this.defaultType,
      this.#defaultColor
    )
  }

  get #typeMap() {
    // Get type definitions.
    // Copy map to add definitions from instance.
    const types = this.#definedTypes.map

    // Get types from instances.
    for (const { typeName } of this.#getAllInstanceFunc()) {
      if (!types.has(typeName)) {
        types.set(typeName, new DefinedType(typeName))
      }
    }

    return types
  }

  delete(id, defaultType) {
    this.#definedTypes.delete(id)
    this.#defaultType = defaultType
    this.#eventEmitter.emit(
      `textae-event.type-definition.${this.#annotationType}.delete`,
      id
    )
  }
}
