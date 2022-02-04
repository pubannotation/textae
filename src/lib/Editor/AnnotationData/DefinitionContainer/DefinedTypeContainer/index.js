import getConfig from './getConfig'

export default class DefinedTypeContainer {
  // Expected values is an array of object.
  // An example of object is {"id": "Regulation","color": "#FFFF66","default": true}.
  constructor(values) {
    // If the order of the type definitions changes,
    // it will be treated as a change, so preserve the order.
    this._list = values
  }

  has(id) {
    return this.map.has(id)
  }

  get(id) {
    return { ...this.map.get(id) }
  }

  replace(id, newType) {
    const index = this._list.findIndex((elem) => elem.id === id)

    if (index !== -1) {
      this._list.splice(index, 1, newType)
    } else {
      this._list.push(newType)
    }
  }

  delete(id) {
    this._list = this._list.filter((elem) => elem.id !== id)
  }

  ids() {
    return this.map.keys()
  }

  getConfig(id) {
    return getConfig(this, id)
  }

  labelIncludes(term) {
    return this._list
      .filter((t) => t.label)
      .filter((t) => t.label.includes(term))
  }

  get map() {
    return this._list.reduce((acc, cur) => acc.set(cur.id, cur), new Map())
  }
}
