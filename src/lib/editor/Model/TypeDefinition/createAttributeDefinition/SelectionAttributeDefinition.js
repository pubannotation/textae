export default class {
  constructor(hash) {
    this.pred = hash.pred
    this._values = hash.values
  }

  get default() {
    return this._values.find((a) => a.default).id
  }

  get values() {
    return this._values.map((v) =>
      Object.assign({}, v, { defaultType: v.id === this.default })
    )
  }

  getLabel(obj) {
    const def = this._getDef(obj)

    if (def && def.label) {
      return def.label
    }

    return obj
  }

  getColor(obj) {
    const def = this._getDef(obj)

    if (def && def.color) {
      return def.color
    }

    return null
  }

  _getDef(obj) {
    return this._values.find((a) => a.id == obj)
  }
}
