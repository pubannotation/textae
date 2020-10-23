export default class AttributeDefinition {
  constructor(hash) {
    this.pred = hash.pred
    this.valueType = hash['value type']
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
