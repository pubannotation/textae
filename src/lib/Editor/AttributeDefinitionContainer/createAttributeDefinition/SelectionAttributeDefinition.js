import AttributeDefinition from '../../../AttributeDefinition'

export default class SelectionAttributeDefinition extends AttributeDefinition {
  constructor(valueType, hash) {
    super(valueType, hash.pred)
    this._values = hash.values || []
  }

  get default() {
    return this.values.find((a) => a.default).id
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

  get values() {
    return this._values
  }

  get hasOnlyOneValue() {
    return this._values.length === 1
  }

  _getMatchedValue(obj) {
    return this.values.find((a) => a.id == obj)
  }

  get externalFormat() {
    return {
      ...super.externalFormat,
      ...{
        'value type': 'selection',
        values: super._valuesClone
      }
    }
  }
}
