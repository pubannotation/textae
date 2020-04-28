export default class {
  // Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
  constructor({ id, subj, pred, obj }, entityContainer) {
    this.id = id
    this.subj = subj
    this.pred = pred
    this.obj = obj
    this._entityContainer = entityContainer
  }

  getDataToRender(typeDomId) {
    return {
      id: this.id,
      pred: this.pred,
      obj: this.obj,
      domId: `${typeDomId}-${this.id}`,
      title: `pred: ${this.pred}, value: ${this.obj}`
    }
  }

  get entity() {
    return this._entityContainer.get(this.subj)
  }
}
