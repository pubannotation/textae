export default class AttributeDefinition {
  constructor(valueType, pred) {
    this.valueType = valueType
    this.pred = pred
  }

  get values() {
    console.assert(this._values, 'this._values to return!')

    return this._values
  }

  get externalFormat() {
    return {
      pred: this.pred
    }
  }

  get _valuesClone() {
    console.assert(this._values, 'this._values is necessary to clone!')

    if (this._values.length === 0) {
      return undefined
    }

    const values = []
    for (const value of this._values) {
      values.push({ ...value })
    }
    return values
  }
}
