import AttributeDefinition from '../AttributeDefinition'
import IntervalNotation from './IntervalNotation'

export default class extends AttributeDefinition {
  constructor(hash) {
    super(hash)
    this.default = hash.default
    this.min = hash.min
    this.max = hash.max
    this.step = hash.step
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
    return Object.assign(super.JSON, {
      'value type': 'numeric',
      default: this.default,
      min: this.min,
      max: this.max,
      step: this.step,
      values: this._values
    })
  }
}
