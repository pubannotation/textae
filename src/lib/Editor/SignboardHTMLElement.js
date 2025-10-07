import dohtml from 'dohtml'
import getLabelBackgroundColor from './getLabelBackgroundColor'
import hexToRGBA from './hexToRGBA'
import anemone from '../component/anemone'

const CSS_CLASS_SELECTED = 'textae-editor__signboard--selected'
const CSS_CLASS_HOVERED = 'textae-editor__signboard--hovered'
const CSS_CLASS_CUTTING = 'textae-editor__signboard--cutting'

export default class SignboardHTMLElement {
  #instance
  #element

  constructor(instance, entityType, HTMLId) {
    this.#instance = instance
    this.#element = dohtml.create(this.#getHtml(HTMLId, entityType))
  }

  get element() {
    return this.#element
  }

  addEventListener(event, listener) {
    this.#element.addEventListener(event, listener)
  }

  hover() {
    this.#element.classList.add(CSS_CLASS_HOVERED)
  }

  select() {
    this.#element.classList.add(CSS_CLASS_SELECTED)
  }

  deselect() {
    this.#element.classList.remove(CSS_CLASS_SELECTED)
  }

  startCut() {
    this.#element.classList.add(CSS_CLASS_CUTTING)
  }

  cancelCut() {
    this.#element.classList.remove(CSS_CLASS_CUTTING)
  }

  clearCSSClass() {
    this.element.className = ''
    this.element.classList.add('textae-editor__signboard')
  }

  updateLabel() {
    const typeValues = this.element.querySelector(
      '.textae-editor__signboard__type-values'
    )
    typeValues.style.backgroundColor = hexToRGBA(this.#instance.color, 0.4)
    typeValues.querySelector(
      '.textae-editor__signboard__type-label'
    ).innerHTML = anemone`${this.#instance.anchorHTML}`

    // Re-create all attributes.
    for (const attributeElement of typeValues.querySelectorAll(
      '.textae-editor__signboard__attribute'
    )) {
      attributeElement.remove()
    }
    for (const a of this.#instance.attributes) {
      typeValues.insertAdjacentHTML('beforeend', anemone`${a.contentHTML}`)
    }
  }

  clarifyLabel() {
    this.element.querySelector(
      '.textae-editor__signboard__type-label'
    ).style.backgroundColor = getLabelBackgroundColor()

    for (const a of this.#instance.attributes) {
      a.clarifyLabelIn(this.element)
    }
  }

  declarifyLabel() {
    this.element.querySelector(
      '.textae-editor__signboard__type-label'
    ).style.backgroundColor = hexToRGBA(this.#instance.color, 1)

    for (const a of this.#instance.attributes) {
      a.declarifyLabelIn(this.element)
    }
  }

  focus() {
    this.#element.querySelector('.textae-editor__signboard__type-label').focus()
  }

  replaceWith(signboardHTMLElement) {
    this.#element.replaceWith(signboardHTMLElement.element)
    return signboardHTMLElement
  }

  reflectTypeGapInTheHeight(height) {
    this.#element.setAttribute('style', `padding-top: ${height}px;`)
  }

  remove() {
    this.#element.remove()
  }

  // A Type element has an entity_pane element that has a label and will have entities.
  #getHtml(HTMLId, entityType) {
    return anemone`
  <div
    class="textae-editor__signboard"
    ${HTMLId ? `id="${HTMLId}"` : ''}
    title="${this.#instance.title}"
    data-entity-type="${entityType}"
    data-id="${this.#instance.id}"
    >
    <div
      class="textae-editor__signboard__type-values"
      style="background-color: ${hexToRGBA(this.#instance.color, 0.4)};"
      >
      <div
        class="textae-editor__signboard__type-label"
        tabindex="0"
        style="background-color: ${getLabelBackgroundColor()};"
        >
        ${this.#instance.anchorHTML}
      </div>
      ${this.#instance.attributes.map((a) => a.contentHTML)}
    </div>
  </div>
  `
  }
}
