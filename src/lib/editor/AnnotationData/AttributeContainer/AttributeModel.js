export default class AttributeModel {
  // Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
  constructor({ id, subj, pred, obj }, entityContainer) {
    this.id = id
    this.subj = subj
    this.pred = pred
    this.obj = obj
    this._entityContainer = entityContainer
  }

  get entity() {
    return this._entityContainer.get(this.subj)
  }

  equalsTo(pred, obj) {
    return this.pred === pred && this.obj === obj
  }
}
