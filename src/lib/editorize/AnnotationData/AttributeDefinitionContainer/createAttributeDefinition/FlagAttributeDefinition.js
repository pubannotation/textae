import AttributeDefinition from './AttributeDefinition'

export default class FlagAttributeDefinition extends AttributeDefinition {
  constructor(valueType, hash) {
    super(valueType, hash.pred)
    this.default = true
    this.label = hash.label
    this.color = hash.color
  }

  getLabel() {
    return this.label
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
    return {
      ...super.JSON,
      ...{
        'value type': 'flag',
        default: this.default,
        label: this.label,
        color: this.color
      }
    }
  }
}
