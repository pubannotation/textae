import getDisplayName from '../../getDisplayName'
import getLabelBackgroundColor from '../../getLabelBackgroundColor'
import getUri from '../../getUri'
import hexToRGBA from '../../hexToRGBA'
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

  get JSON() {
    return {
      id: this.id,
      subj: this.subj,
      pred: this.pred,
      obj: this._obj
    }
  }

  equalsTo(pred, obj) {
    // If the attribute is a numeric type,
    // then the type of obj is numeric.
    // Cast obj to a string to compare.
    return this.pred === pred && String(this._obj) === obj
  }

  render() {
    this.subjectModel.updateElement()
  }

  erase() {
    this.subjectModel.updateElement()
  }

  clarifyLabelIn(parentElement) {
    parentElement.querySelector(
      `[data-pred="${this.pred}"][data-obj="${this.obj}"] .textae-editor__signboard__attribute-label`
    ).style.backgroundColor = hexToRGBA(this._color, 1)
  }

  declarifyLabelIn(parentElement) {
    parentElement.querySelector(
      `[data-pred="${this.pred}"][data-obj="${this.obj}"] .textae-editor__signboard__attribute-label`
    ).style.backgroundColor = getLabelBackgroundColor()
  }

  get contentHTML() {
    return `
      <div
        class="textae-editor__signboard__attribute"
        title="${this._title}"
        data-pred="${this.pred}"
        data-obj="${this.obj}"
        ${`style="background-color: ${hexToRGBA(this._color, 0.4)};"`}
        >
        <span
          class="textae-editor__signboard__attribute-label"
          ${`style="background-color: ${getLabelBackgroundColor()};"`}
          >
          ${toAnchorElement(this._displayName, this._href)}
        </span>
      </div>
      `
  }

  get height() {
    const attributeUnitHeight = 18

    if (this._definitionContainer.get(this.pred).valueType === 'medeia') {
      return this._definitionContainer.get(this.pred).height
    } else {
      return attributeUnitHeight
    }
  }

  get _title() {
    return `[${this.id}] pred: ${this.pred}, value: ${this._obj}`
  }

  get _displayName() {
    return getDisplayName(
      this._namespace,
      typeof this._obj === 'string' ? this._obj : '',
      this._definitionContainer.getDisplayName(this.pred, this._obj)
    )
  }

  get _href() {
    return getUri(
      this._namespace,
      typeof this._obj === 'string' ? this._obj : ''
    )
  }

  get _color() {
    return (
      this._definitionContainer.getColor(this.pred, this._obj) ||
      this.subjectModel.color
    )
  }
}
