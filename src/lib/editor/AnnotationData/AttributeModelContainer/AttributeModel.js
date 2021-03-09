import getUri from '../../getUri'

export default class AttributeModel {
  // Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
  constructor(
    { id, subj, pred, obj },
    entityContainer,
    namespace,
    definitionContainer
  ) {
    this.id = id
    this.subj = subj
    this.pred = pred
    this.obj = obj
    this._entityContainer = entityContainer
    this._namespace = namespace
    this._definitionContainer = definitionContainer
  }

  get entity() {
    return this._entityContainer.get(this.subj)
  }

  get href() {
    return getUri(this._namespace, typeof this.obj === 'string' ? this.obj : '')
  }

  get color() {
    return this._definitionContainer.getColor(this.pred, this.obj)
  }

  equalsTo(pred, obj) {
    // If the attribute is a numeric type,
    // then the type of obj is numeric.
    // Cast obj to a string to compare.
    return this.pred === pred && String(this.obj) === obj
  }
}
