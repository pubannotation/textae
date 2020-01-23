export default class {
  constructor(hash) {
    this.pred = hash.pred
  }

  get JSON() {
    return {
      pred: this.pred
    }
  }
}
