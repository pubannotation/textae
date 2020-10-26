import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import updateTextBoxHeight from './updateTextBoxHeight'
import resetLineHeight from './resetLineHeight'

export default class {
  constructor(el, annotationData, gridHeight) {
    this._el = el
    this._annotationData = annotationData
    this._gridHeight = gridHeight
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

  updateLineHeight() {
    if (this._annotationData.span.allObjectSpans.length) {
      this.lineHeight = this._gridHeight.currentMaxHeight
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
