import AttributeDefinition from './editorize/AttributeDefinitionContainer/createAttributeDefinition/AttributeDefinition'
import IntervalNotation from './IntervalNotation'

export const DEFAULT = 0
export const STEP = 2

export default class NumericAttributeDefinition extends AttributeDefinition {
  constructor(valueType, hash) {
    super(valueType, hash.pred)
    this.default = Number.isNaN(parseFloat(hash.default))
      ? DEFAULT
      : parseFloat(hash.default)
    if (!Number.isNaN(parseFloat(hash.min))) {
      this.min = parseFloat(hash.min)
    }
    if (!Number.isNaN(parseFloat(hash.max))) {
      this.max = parseFloat(hash.max)
    }
    this.step = Number.isNaN(parseFloat(hash.step))
      ? STEP
      : parseFloat(hash.step)
    this._values = hash.values || []
  }

  getLabel(obj) {
    const def = this._getMatchedValue(obj)

    if (def && def.label) {
      return def.label
    }
  }

  getDisplayName(obj) {
    return this.getLabel(obj) || String(obj)
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
      .filter((a) => a.range !== 'default')
      .find((a) => new IntervalNotation(a.range).test(obj))

    if (match) {
      return match
    }

    const defaultValue = this._values.find((a) => a.range === 'default')
    if (defaultValue) {
      return defaultValue
    }

    return null
  }

  get JSON() {
    return {
      ...super.JSON,
      ...{
        'value type': 'numeric',
        default: this.default,
        min: this.min,
        max: this.max,
        step: this.step,
        values: super._valuesClone
      }
    }
  }
}
