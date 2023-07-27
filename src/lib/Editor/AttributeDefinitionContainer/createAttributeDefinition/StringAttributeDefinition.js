import isAbleToParseFloat from '../../../isAbleToParseFloat'
import AttributeDefinition from '../../../AttributeDefinition'

export default class StringAttributeDefinition extends AttributeDefinition {
  constructor(valueType, hash) {
    super(valueType, hash.pred)
    this.autocompletionWs = hash.autocompletion_ws
    this.default = hash.default
    if (isAbleToParseFloat(hash['media height'])) {
      this.mediaHeight = parseFloat(hash['media height'])
    }
    this._values = hash.values || []
  }

  getLabel(obj) {
    const def = this._getMatchedValue(obj)

    if (def && def.label) {
      return def.label
    }
  }

  getDisplayName(obj) {
    return this.getLabel(obj)
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

  get externalFormat() {
    return {
      ...super.externalFormat,
      ...{
        'value type': 'string',
        autocompletion_ws: this.autocompletionWs,
        default: this.default,
        values: super._valuesClone,
        'media height': this.mediaHeight
      }
    }
  }
}
