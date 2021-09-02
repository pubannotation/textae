import dohtml from 'dohtml'
import getLabelBackgroundColor from './getLabelBackgroundColor'
import hexToRGBA from './hexToRGBA'

export default class SignboardHTMLElement {
  constructor(model, entityType, HTMLId) {
    this._model = model
    this._element = dohtml.create(this._getHtml(HTMLId, entityType))
  }

  get element() {
    return this._element
  }

  updateCSSClass(className) {
    this.element.className = ''
    this.element.classList.add('textae-editor__signboard')
    this.element.classList.add(className)
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
