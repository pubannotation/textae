import AttributeDefinition from './AttributeDefinition'

export default class FlagAttributeDefinition extends AttributeDefinition {
  constructor(hash) {
    super(hash)
    this.default = true
    this._label = hash.label
    this._color = hash.color
  }

  getDisplayName() {
    if (this._label) {
      return this._label
    }

    return this.pred
  }

  getColor() {
    return this._color
  }

  get JSON() {
    return Object.assign(super.JSON, {
      'value type': 'flag',
      default: this.default,
      label: this._label,
      color: this._color
    })
  }
}
