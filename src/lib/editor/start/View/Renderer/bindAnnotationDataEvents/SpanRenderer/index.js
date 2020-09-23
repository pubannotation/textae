import create from './create'
import destroy from './destroy'

export default class {
  constructor(renderEntityFunc) {
    this._renderEntityFunc = renderEntityFunc
  }

  render(span) {
    create(span, this._renderEntityFunc)
  }

  remove(span) {
    if (span.styles.size > 0) {
      const spanElement = span.element
      spanElement.removeAttribute('tabindex')
      spanElement.classList.remove('textae-editor__span')
    } else {
      destroy(span)
    }
  }
}
