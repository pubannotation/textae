import create from './create'
import destroy from './destroy'

export default class {
  constructor(entityRenderer) {
    this._entityRenderer = entityRenderer
  }

  render(span) {
    create(span, this._entityRenderer)
  }

  remove(span) {
    if (span.hasStyle) {
      const spanElement = span.element
      spanElement.removeAttribute('tabindex')
      spanElement.classList.remove('textae-editor__span')
    } else {
      destroy(span)
    }
  }
}
