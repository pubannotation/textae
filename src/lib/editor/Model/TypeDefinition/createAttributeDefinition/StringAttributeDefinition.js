import AttributeDefinition from './AttributeDefinition'
export default class extends AttributeDefinition {
  constructor(hash) {
    super(hash)
    this.default = hash.default
    this._values = hash.values
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
    const match = this._values
      .filter((a) => a.pattern !== 'default')
      .find((a) => new RegExp(a.pattern).test(obj))

    if (match) {
      return match
    }

    const defaultValue = this._values.find((a) => a.pattern === 'default')
    if (defaultValue) {
      return defaultValue
    }

    return null
  }
}
