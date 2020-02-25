import AttributeDefinition from './AttributeDefinition'

export default class extends AttributeDefinition {
  constructor(hash) {
    super(hash)
    this.values = hash.values || []
  }

  get default() {
    return this.values.find((a) => a.default).id
  }

  getLabel(obj) {
    const def = this._getDef(obj)

    if (def && def.label) {
      return def.label
    }

    return
  }

  getColor(obj) {
    const def = this._getDef(obj)

    if (def && def.color) {
      return def.color
    }

    return null
  }

  _getDef(obj) {
    return this.values.find((a) => a.id == obj)
  }

  get JSON() {
    const values = []
    for (const value of this.values) {
      values.push(Object.assign({}, value))
    }

    return Object.assign(super.JSON, {
      'value type': 'selection',
      values
    })
  }
}
