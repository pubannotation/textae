import AttributeDefinition from './AttributeDefinition'

export default class FlagAttributeDefinition extends AttributeDefinition {
  constructor(hash) {
    super(hash)
    this.default = true
    this.label = hash.label
    this.color = hash.color
  }

  getDisplayName() {
    if (this.label) {
      return this.label
    }

    return this.pred
  }

  getColor() {
    return this.color
  }

  get JSON() {
    return Object.assign(super.JSON, {
      'value type': 'flag',
      default: this.default,
      label: this.label,
      color: this.color
    })
  }
}
