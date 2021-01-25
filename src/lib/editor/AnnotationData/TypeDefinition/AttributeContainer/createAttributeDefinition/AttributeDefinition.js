export default class AttributeDefinition {
  constructor(valueType, pred) {
    this.valueType = valueType
    this.pred = pred
  }

  get JSON() {
    return {
      pred: this.pred
    }
  }

  get _valuesClone() {
    console.assert(this._values, 'this._values is necessary to clone!')

    const values = []
    for (const value of this._values) {
      values.push(Object.assign({}, value))
    }
    return values
  }
}
