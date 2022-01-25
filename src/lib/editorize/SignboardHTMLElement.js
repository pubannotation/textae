import dohtml from 'dohtml'
import getLabelBackgroundColor from './getLabelBackgroundColor'
import hexToRGBA from './hexToRGBA'

const CSS_CLASS_SELECTED = 'textae-editor__signboard--selected'
const CSS_CLASS_HOVERED = 'textae-editor__signboard--hovered'
const CSS_CLASS_CUTTING = 'textae-editor__signboard--cutting'

export default class SignboardHTMLElement {
  constructor(model, entityType, HTMLId) {
    this._model = model
    this._element = dohtml.create(this._getHtml(HTMLId, entityType))
  }

  get element() {
    return this._element
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
    typeValues.style.backgroundColor = hexToRGBA(this._model.color, 0.4)
    typeValues.querySelector(
      '.textae-editor__signboard__type-label'
    ).innerHTML = this._model.anchorHTML

    // Re-create all attributes.
    for (const attributeElement of typeValues.querySelectorAll(
      '.textae-editor__signboard__attribute'
    )) {
      attributeElement.remove()
    }
    for (const a of this._model.attributes) {
      typeValues.insertAdjacentHTML('beforeend', a.contentHTML)
    }
  }

  clarifyLabel() {
    this.element.querySelector(
      '.textae-editor__signboard__type-label'
    ).style.backgroundColor = hexToRGBA(this._model.color, 1)

    for (const a of this._model.attributes) {
      a.clarifyLabelIn(this.element)
    }
  }

  declarifyLabel() {
    this.element.querySelector(
      '.textae-editor__signboard__type-label'
    ).style.backgroundColor = getLabelBackgroundColor()

    for (const a of this._model.attributes) {
      a.declarifyLabelIn(this.element)
    }
  }

  focus() {
    this._element.querySelector('.textae-editor__signboard__type-label').focus()
  }

  replaceWith(element) {
    this._element.replaceWith(element)
  }

  reflectTypeGapInTheHeight(height) {
    this._element.setAttribute('style', `padding-top: ${height}px;`)
  }

  remove() {
    this._element.remove()
  }

  // A Type element has an entity_pane elment that has a label and will have entities.
  _getHtml(HTMLId, entityType) {
    return `
  <div
    class="textae-editor__signboard"
    ${HTMLId ? `id="${HTMLId}"` : ''}
    title="${this._model.title}"
    data-entity-type="${entityType}"
    data-id="${this._model.id}"
    >
    <div
      class="textae-editor__signboard__type-values"
      style="background-color: ${hexToRGBA(this._model.color, 0.4)};"
      >
      <div
        class="textae-editor__signboard__type-label"
        tabindex="0"
        style="background-color: ${getLabelBackgroundColor()};"
        >
        ${this._model.anchorHTML}
      </div>
      ${this._model.attributes.map((a) => a.contentHTML).join('')}
    </div>
  </div>
  `
  }
}
