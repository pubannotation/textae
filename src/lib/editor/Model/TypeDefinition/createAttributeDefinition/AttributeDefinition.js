export default class {
  constructor(hash) {
    this.pred = hash.pred
    this.valueType = hash['value type']
  }

  get JSON() {
    return {
      pred: this.pred
    }
  }
}
