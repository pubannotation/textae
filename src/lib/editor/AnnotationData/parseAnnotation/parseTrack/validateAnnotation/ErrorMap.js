export default class ErrorMap {
  constructor() {
    this._map = new Map()
  }

  set(key, value) {
    this._map.set(key, value)
  }

  get(key) {
    return this._map.has(key) ? this._map.get(key)[0] : []
  }

  getInhibitors(key) {
    return this._map.has(key) ? this._map.get(key)[1] : []
  }

  get size() {
    return this._map.size
  }
}

export function collectErrors(name, errorMaps) {
  return errorMaps.reduce((acc, errorMap) => acc.concat(errorMap.get(name)), [])
}
