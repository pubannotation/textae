import getConfig from './getConfig'

export default class DefinedTypeContainer {
  constructor(values) {
    // expected values is an array of object. example of object is {"id": "Regulation","color": "#FFFF66","default": true}.
    this._map = values.reduce((acc, cur) => acc.set(cur.id, cur), new Map())
  }

  has(id) {
    return this._map.has(id)
  }

  get(id) {
    return { ...this._map.get(id) }
  }

  replace(id, newType) {
    // Delete old ID when changing ID.
    if (id !== newType.id) {
      this._map.delete(id)
    }
    this._map.set(newType.id, newType)
  }

  delete(id) {
    this._map.delete(id)
  }

  ids() {
    return this._map.keys()
  }

  getConfig(id) {
    return getConfig(this, id)
  }

  labelIncludes(term) {
    return [...this._map.values()]
      .filter((t) => t.label)
      .filter((t) => t.label.includes(term))
  }

  get map() {
    return this._map
  }
}
