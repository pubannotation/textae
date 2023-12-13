import dohtml from 'dohtml'
import getLabelBackgroundColor from './getLabelBackgroundColor'
import hexToRGBA from './hexToRGBA'
import anemone from '../component/anemone'

const CSS_CLASS_SELECTED = 'textae-editor__signboard--selected'
const CSS_CLASS_HOVERED = 'textae-editor__signboard--hovered'
const CSS_CLASS_CUTTING = 'textae-editor__signboard--cutting'

export default class SignboardHTMLElement {
  constructor(instance, entityType, HTMLId) {
    this._instance = instance
    this._element = dohtml.create(this.#getHtml(HTMLId, entityType))
  }

  get element() {
    return this._element
  }

  addEventListener(event, listener) {
    this._element.addEventListener(event, listener)
  }

  hover() {
    this._element.classList.add(CSS_CLASS_HOVERED)
  }

  select() {
    this._element.classList.add(CSS_CLASS_SELECTED)
  }

  deselect() {
    this._element.classList.remove(CSS_CLASS_SELECTED)
  }

  startCut() {
    this._element.classList.add(CSS_CLASS_CUTTING)
  }

  cancelCut() {
    this._element.classList.remove(CSS_CLASS_CUTTING)
  }

  clearCSSClass() {
    this.element.className = ''
    this.element.classList.add('textae-editor__signboard')
  }

  updateLabel() {
    const typeValues = this.element.querySelector(
      '.textae-editor__signboard__type-values'
    )
    typeValues.style.backgroundColor = hexToRGBA(this._instance.color, 0.4)
    typeValues.querySelector(
      '.textae-editor__signboard__type-label'
    ).innerHTML = anemone`${this._instance.anchorHTML}`

    // Re-create all attributes.
    for (const attributeElement of typeValues.querySelectorAll(
      '.textae-editor__signboard__attribute'
    )) {
      attributeElement.remove()
    }
    for (const a of this._instance.attributes) {
      typeValues.insertAdjacentHTML('beforeend', a.contentHTML)
    }
  }

  clarifyLabel() {
    this.element.querySelector(
      '.textae-editor__signboard__type-label'
    ).style.backgroundColor = hexToRGBA(this._instance.color, 1)

    for (const a of this._instance.attributes) {
      a.clarifyLabelIn(this.element)
    }
  }

  declarifyLabel() {
    this.element.querySelector(
      '.textae-editor__signboard__type-label'
    ).style.backgroundColor = getLabelBackgroundColor()

    for (const a of this._instance.attributes) {
      a.declarifyLabelIn(this.element)
    }
  }

  focus() {
    this._element.querySelector('.textae-editor__signboard__type-label').focus()
  }

  replaceWith(signboardHTMLElement) {
    this._element.replaceWith(signboardHTMLElement.element)
    return signboardHTMLElement
  }

  reflectTypeGapInTheHeight(height) {
    this._element.setAttribute('style', `padding-top: ${height}px;`)
  }

  remove() {
    this._element.remove()
  }

  // A Type element has an entity_pane element that has a label and will have entities.
  #getHtml(HTMLId, entityType) {
    return anemone`
  <div
    class="textae-editor__signboard"
    ${HTMLId ? `id="${HTMLId}"` : ''}
    title="${this._instance.title}"
    data-entity-type="${entityType}"
    data-id="${this._instance.id}"
    >
    <div
      class="textae-editor__signboard__type-values"
      style="background-color: ${hexToRGBA(this._instance.color, 0.4)};"
      >
      <div
        class="textae-editor__signboard__type-label"
        tabindex="0"
        style="background-color: ${getLabelBackgroundColor()};"
        >
        ${this._instance.anchorHTML}
      </div>
      ${() => this._instance.attributes.map((a) => a.contentHTML)}
    </div>
  </div>
  `
  }
}
