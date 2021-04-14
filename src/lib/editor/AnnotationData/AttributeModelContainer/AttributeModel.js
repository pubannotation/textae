import getDisplayName from '../../getDisplayName'
import getUri from '../../getUri'
import toAnchorElement from '../../toAnchorElement'

export default class AttributeModel {
  // Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
  constructor(
    { id, subj, pred, obj },
    entityContainer,
    relationContaier,
    namespace,
    definitionContainer
  ) {
    this.id = id
    this.subj = subj
    this.pred = pred
    this._obj = obj
    this._entityContainer = entityContainer
    this._relationContaier = relationContaier
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
    return (
      this._entityContainer.get(this.subj) ||
      this._relationContaier.get(this.subj)
    )
  }

  get title() {
    return `[${this.id}] pred: ${this.pred}, value: ${this._obj}`
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

  get contentHTML() {
    return `
      <div
        class="textae-editor__signboard__attribute"
        title="${this.title}"
        data-pred="${this.pred}"
        data-obj="${this.obj}"
        ${this.color ? `style="background-color: ${this.color};"` : ''}
        >
        <span class="textae-editor__signboard__attribute-label">
          ${toAnchorElement(this.displayName, this.href)}
        </span>
      </div>
      `
  }

  equalsTo(pred, obj) {
    // If the attribute is a numeric type,
    // then the type of obj is numeric.
    // Cast obj to a string to compare.
    return this.pred === pred && String(this._obj) === obj
  }
}
