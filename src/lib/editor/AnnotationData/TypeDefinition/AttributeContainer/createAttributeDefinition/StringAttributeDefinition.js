import AttributeDefinition from './AttributeDefinition'
export default class StringAttributeDefinition extends AttributeDefinition {
  constructor(hash) {
    super(hash)
    this.autocompletionWs = hash.autocompletion_ws
    this.default = hash.default
    this._values = hash.values || []
  }

  getDisplayName(obj) {
    const def = this._getMatchedValue(obj)

    if (def && def.label) {
      return def.label
    }

    return
  }

  getColor(obj) {
    const def = this._getMatchedValue(obj)

    if (def && def.color) {
      return def.color
    }

    return null
  }

  _getMatchedValue(obj) {
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

  get JSON() {
    return Object.assign(super.JSON, {
      'value type': 'string',
      autocompletion_ws: this.autocompletionWs,
      default: this.default,
      values: super._valuesClone
    })
  }
}
