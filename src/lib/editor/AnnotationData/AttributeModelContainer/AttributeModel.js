import getDisplayName from '../../getDisplayName'
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
    this._obj = obj
    this._entityContainer = entityContainer
    this._namespace = namespace
    this._definitionContainer = definitionContainer
  }

  get obj() {
    return this._obj
  }

  set obj(value) {
    if (this._definitionContainer.get(this.pred).valueType === 'numeric') {
      this._obj = parseFloat(value)
    } else {
      this._obj = value
    }
  }

  get subjectModel() {
    return this._entityContainer.get(this.subj)
  }

  get title() {
    return `pred: ${this.pred}, value: ${this._obj}`
  }

  get displayName() {
    return getDisplayName(
      this._namespace,
      typeof this._obj === 'string' ? this._obj : '',
      this._definitionContainer.getDisplayName(this.pred, this._obj)
    )
  }

  get href() {
    return getUri(
      this._namespace,
      typeof this._obj === 'string' ? this._obj : ''
    )
  }

  get color() {
    return this._definitionContainer.getColor(this.pred, this._obj)
  }

  equalsTo(pred, obj) {
    // If the attribute is a numeric type,
    // then the type of obj is numeric.
    // Cast obj to a string to compare.
    return this.pred === pred && String(this._obj) === obj
  }
}
