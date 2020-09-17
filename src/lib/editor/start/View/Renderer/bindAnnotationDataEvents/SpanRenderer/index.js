import create from './create'
import destroy from './destroy'

export default class {
  constructor(editor, renderEntityFunc) {
    this._editor = editor
    this._renderEntityFunc = renderEntityFunc
  }

  render(span) {
    create(this._editor, span, this._renderEntityFunc)
  }

  remove(span) {
    if (span.styles.size > 0) {
      const spanElement = document.querySelector(`#${span.id}`)
      spanElement.removeAttribute('tabindex')
      spanElement.classList.remove('textae-editor__span')
    } else {
      destroy(span.id)
    }
  }
}
