import anemone from '../../../component/anemone.js'
import getDisplayName from '../../getDisplayName/index.js'
import getLabelBackgroundColor from '../../getLabelBackgroundColor.js'
import getURI from '../../getURI.js'
import hexToRGBA from '../../hexToRGBA.js'
import toAnchorElement from '../../toAnchorElement.js'

export default class AttributeInstance {
  // Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
  /**
   *
   * @param {import('../DefinitionContainer/index.js').default} definitionContainer
   */
  constructor(
    { id, subj, pred, obj },
    entityContainer,
    relationContainer,
    namespace,
    definitionContainer,
    mediaDictionary
  ) {
    this.id = id
    this.subj = subj
    this.pred = pred
    this._obj = obj
    this._entityContainer = entityContainer
    this._relationContainer = relationContainer
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._mediaDictionary = mediaDictionary

    // If the extension cannot be used to determine whether the image is an image or not,
    // the Content-Type header is acquired to determine whether the image is an image or not.
    if (this.#valueType === 'string' && !this.#hasImageExtension) {
      this._mediaDictionary.acquireContentTypeOf(this.#href).then((isImage) => {
        if (isImage) {
          this.updateElement()
        }
      })
    }
  }

  get obj() {
    return this._obj
  }

  set obj(value) {
    if (this.#valueType === 'numeric') {
      this._obj = parseFloat(value)
    } else {
      this._obj = value
    }
  }

  get subjectInstance() {
    return (
      this._entityContainer.get(this.subj) ||
      this._relationContainer.get(this.subj)
    )
  }

  get externalFormat() {
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

  updateElement() {
    this.subjectInstance.updateElement()
  }

  clarifyLabelIn(parentElement) {
    parentElement.querySelector(
      `[data-pred="${this.pred}"][data-obj="${this.obj}"] .textae-editor__signboard__attribute-label`
    ).style.backgroundColor = hexToRGBA(this.#color, 1)
  }

  declarifyLabelIn(parentElement) {
    parentElement.querySelector(
      `[data-pred="${this.pred}"][data-obj="${this.obj}"] .textae-editor__signboard__attribute-label`
    ).style.backgroundColor = getLabelBackgroundColor()
  }

  get contentHTML() {
    return () => anemone`
      <div
        class="textae-editor__signboard__attribute"
        title="${this.#title}"
        data-pred="${this.pred}"
        data-obj="${this.obj}"
        style="background-color: ${hexToRGBA(this.#color, 0.4)}; height: ${
          this.height
        }px;"
        >
        <span
          class="textae-editor__signboard__attribute-label"
          style="background-color: ${getLabelBackgroundColor()};"
          >
          ${this.#labelOrMedia}
        </span>
      </div>
      `
  }

  get height() {
    if (this._definitionContainer.get(this.pred).mediaHeight) {
      return this._definitionContainer.get(this.pred).mediaHeight
    } else {
      return 18
    }
  }

  get #title() {
    return `[${this.id}] pred: ${this.pred}, value: ${this._obj}`
  }

  get #labelOrMedia() {
    if (this.#isMedia) {
      return `<img src="${this.obj}" height="${this.height}" >`
    } else {
      return toAnchorElement(this.#displayName, this.#href)
    }
  }

  get #isMedia() {
    return (
      this.#valueType === 'string' &&
      (this.#hasImageExtension ||
        this._mediaDictionary.hasImageContentTypeOf(this.#href))
    )
  }

  get #hasImageExtension() {
    return /\.(jpg|png|gif)$/.test(this.#href)
  }

  get #displayName() {
    return getDisplayName(
      this._namespace,
      typeof this._obj === 'string' ? this._obj : '',
      this._definitionContainer.getDisplayName(this.pred, this._obj)
    )
  }

  get #href() {
    return getURI(
      this._namespace,
      typeof this._obj === 'string' ? this._obj : ''
    )
  }

  get #color() {
    return (
      this._definitionContainer.getColor(this.pred, this._obj) ||
      this.subjectInstance.color
    )
  }

  get #valueType() {
    return this._definitionContainer.get(this.pred).valueType
  }
}
