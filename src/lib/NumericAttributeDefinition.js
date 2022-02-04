import AttributeDefinition from './AttributeDefinition'
import IntervalNotation from './IntervalNotation'
import isAbleToParseFloat from './isAbleToParseFloat'

export const DEFAULT = 0
export const STEP = 2

export default class NumericAttributeDefinition extends AttributeDefinition {
  constructor(valueType, hash) {
    super(valueType, hash.pred)
    this.default = isAbleToParseFloat(hash.default)
      ? parseFloat(hash.default)
      : DEFAULT
    if (isAbleToParseFloat(hash.min)) {
      this.min = parseFloat(hash.min)
    }
    if (isAbleToParseFloat(hash.max)) {
      this.max = parseFloat(hash.max)
    }
    this.step = isAbleToParseFloat(hash.step) ? parseFloat(hash.step) : STEP
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
