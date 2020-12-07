import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import updateTextBoxHeight from './updateTextBoxHeight'
import resetLineHeight from './resetLineHeight'

export default class TextBox {
  constructor(el, annotationData) {
    this._el = el
    this._annotationData = annotationData
  }

  get boundingClientRect() {
    return this._el.getBoundingClientRect()
  }

  get lineHeight() {
    return getLineHeight(this._el)
  }

  set lineHeight(val) {
    setLineHeight(this._el, val)
    updateTextBoxHeight(this._el)
  }

  render(text) {
    this._el.innerHTML = text
  }

  updateLineHeight(gridRectangle) {
    if (this._annotationData.span.allDenotationSpans.length) {
      this.lineHeight = this._annotationData.gridRectangle.maxHeight
    } else {
      this._resetLineHeight()
    }
  }

  _resetLineHeight() {
    resetLineHeight(this._el)
    updateTextBoxHeight(this._el)
  }

  forceUpdate() {
    updateTextBoxHeight(this._el)
  }
}
