import AttributeDefinition from './AttributeDefinition'

export default class extends AttributeDefinition {
  constructor(hash) {
    super(hash)
    this._values = hash.values || []
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

  get values() {
    return this._values
  }

  _getDef(obj) {
    return this.values.find((a) => a.id == obj)
  }

  get JSON() {
    return Object.assign(super.JSON, {
      'value type': 'selection',
      values: super._valuesClone
    })
  }
}
