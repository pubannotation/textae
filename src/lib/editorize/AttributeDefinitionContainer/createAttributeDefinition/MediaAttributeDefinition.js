import AttributeDefinition from './AttributeDefinition'

export default class MediaAttributeDefinition extends AttributeDefinition {
  constructor(valueType, hash) {
    super(valueType, hash.pred)
    this.default = ''
    this.height = hash.height
  }

  get JSON() {
    return {
      ...super.JSON,
      ...{
        'value type': 'media',
        default: this.default,
        height: this.height
      }
    }
  }
}
