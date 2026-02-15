import DefinedType from '../../DefinedType'
import getForwardMatchID from './getForwardMatchID'

export default class DefinedTypeContainer {
  /** @type {Array<DefinedType>} */
  #types

  // Expected values is an array of object.
  // An example of object is {"id": "Regulation","color": "#FFFF66","default": true}.
  constructor(values = []) {
    // If the order of the type definitions changes,
    // it will be treated as a change, so preserve the order.

    this.#types = values.map(
      (value) =>
        new DefinedType(value.id, value.color, value.label, value.default)
    )
  }

  has(id) {
    return this.map.has(id)
  }

  get default() {
    return this.#types.find((type) => type.default === true)
  }

  replace(id, newType) {
    newType = new DefinedType(
      newType.id,
      newType.color,
      newType.label,
      newType.default
    )

    const index = this.#types.findIndex((elem) => elem.id === id)

    if (index !== -1) {
      this.#types.splice(index, 1, newType)
    } else {
      this.#types.push(newType)
    }
  }

  delete(id) {
    this.#types = this.#types.filter((elem) => elem.id !== id)
  }

  ids() {
    return this.map.keys()
  }

  getColorOf(id) {
    return this.#getConfigOf(id)?.color
  }

  getLabelOf(id) {
    return this.#getConfigOf(id)?.label
  }

  /**
   * Returns list of label includes the term.
   * @param {string} term
   * @returns {Array}
   */
  labelsIncludes(term) {
    return this.#types
      .filter((t) => t.label)
      .filter((t) => t.label.includes(term))
  }

  get map() {
    return new Map(this.#types.map((type) => [type.id, type]))
  }

  #getConfigOf(id) {
    // Return value if perfectly matched
    if (this.has(id)) {
      return this.map.get(id)
    }

    // Return value if forward matched
    const forwardMatchId = getForwardMatchID(this.ids(), id)
    return this.map.get(forwardMatchId)
  }
}
