import anemone from '../../../component/anemone.js'
import getDisplayName from '../../getDisplayName/index.js'
import getLabelBackgroundColor from '../../getLabelBackgroundColor.js'
import getURI from '../../getURI.js'
import hexToRGBA from '../../hexToRGBA.js'
import toAnchorElement from '../../toAnchorElement.js'

export default class AttributeInstance {
  #id
  #subj
  #pred
  #obj
  #entityInstanceContainer
  #relationInstanceContainer
  #namespaceInstanceContainer
  #definitionContainer
  #mediaDictionary

  // Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
  /**
   *
   * @param {import('../DefinitionContainer/index.js').default} definitionContainer
   */
  constructor(
    { id, subj, pred, obj },
    entityInstanceContainer,
    relationInstanceContainer,
    namespaceInstanceContainer,
    definitionContainer,
    mediaDictionary
  ) {
    this.#id = id
    this.#subj = subj
    this.#pred = pred
    this.#obj = obj
    this.#entityInstanceContainer = entityInstanceContainer
    this.#relationInstanceContainer = relationInstanceContainer
    this.#namespaceInstanceContainer = namespaceInstanceContainer
    this.#definitionContainer = definitionContainer
    this.#mediaDictionary = mediaDictionary

    // If the extension cannot be used to determine whether the image is an image or not,
    // the Content-Type header is acquired to determine whether the image is an image or not.
    if (this.#valueType === 'string' && !this.#hasImageExtension) {
      this.#mediaDictionary.acquireContentTypeOf(this.#href).then((isImage) => {
        if (isImage) {
          this.updateElement()
        }
      })
    }
  }

  get id() {
    return this.#id
  }

  set id(value) {
    this.#id = value
  }

  get subj() {
    return this.#subj
  }

  set subj(value) {
    this.#subj = value
  }

  get pred() {
    return this.#pred
  }

  set pred(value) {
    this.#pred = value
  }

  get obj() {
    return this.#obj
  }

  set obj(value) {
    if (this.#valueType === 'numeric') {
      this.#obj = parseFloat(value)
    } else {
      this.#obj = value
    }
  }

  get subjectInstance() {
    return (
      this.#entityInstanceContainer.get(this.subj) ||
      this.#relationInstanceContainer.get(this.subj)
    )
  }

  get externalFormat() {
    return {
      id: this.id,
      subj: this.subj,
      pred: this.pred,
      obj: this.#obj
    }
  }

  equalsTo(pred, obj) {
    // If the attribute is a numeric type,
    // then the type of obj is numeric.
    // Cast obj to a string to compare.
    return this.pred === pred && String(this.#obj) === obj
  }

  updateElement() {
    this.subjectInstance.updateElement()
  }

  clarifyLabelIn(parentElement) {
    parentElement.querySelector(
      anemone`[data-id="${this.id}"] .textae-editor__signboard__attribute-label`
    ).style.backgroundColor = getLabelBackgroundColor()
  }

  declarifyLabelIn(parentElement) {
    parentElement.querySelector(
      anemone`[data-id="${this.id}"] .textae-editor__signboard__attribute-label`
    ).style.backgroundColor = hexToRGBA(this.#color, 1)
  }

  get contentHTML() {
    return () => anemone`
      <div
        class="textae-editor__signboard__attribute"
        title="${this.#title}"
        data-id="${this.id}"
        style="background-color: ${hexToRGBA(this.#color, 0.4)}; height: ${
          this.height
        }px;"
        >
        <span
          class="textae-editor__signboard__attribute-label"
          style="background-color: ${hexToRGBA(this.#color, 1)};"
          >
          ${this.#labelOrMedia}
        </span>
      </div>
      `
  }

  get height() {
    if (this.#definitionContainer.get(this.pred).mediaHeight) {
      return this.#definitionContainer.get(this.pred).mediaHeight
    } else {
      return 18
    }
  }

  get #title() {
    return `[${this.id}] pred: ${this.pred}, value: ${this.#obj}`
  }

  get #labelOrMedia() {
    if (this.#isMedia) {
      return () => `<img src="${this.obj}" height="${this.height}" >`
    } else {
      return toAnchorElement(this.#displayName, this.#href)
    }
  }

  get #isMedia() {
    return (
      this.#valueType === 'string' &&
      (this.#hasImageExtension ||
        this.#mediaDictionary.hasImageContentTypeOf(this.#href))
    )
  }

  get #hasImageExtension() {
    return /\.(jpg|png|gif)$/.test(this.#href)
  }

  get #displayName() {
    return getDisplayName(
      this.#namespaceInstanceContainer,
      typeof this.#obj === 'string' ? this.#obj : '',
      this.#definitionContainer.getDisplayName(this.pred, this.#obj)
    )
  }

  get #href() {
    return getURI(
      this.#namespaceInstanceContainer,
      typeof this.#obj === 'string' ? this.#obj : ''
    )
  }

  get #color() {
    return (
      this.#definitionContainer.getColor(this.pred, this.#obj) ||
      this.subjectInstance.color
    )
  }

  get #valueType() {
    return this.#definitionContainer.get(this.pred).valueType
  }
}
