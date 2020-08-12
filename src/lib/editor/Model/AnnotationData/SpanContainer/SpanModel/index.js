import idFactory from '../../../../idFactory'
import getBigBrotherSpan from './getBigBrotherSpan'

export default class {
  constructor(editor, span, spanContainer) {
    this._editor = editor
    this._span = span
    this.styles = new Set()
    this._spanContainer = spanContainer
  }

  get id() {
    return idFactory.makeSpanId(this._editor, this._span)
  }

  get begin() {
    return this._span.begin
  }

  get end() {
    return this._span.end
  }

  get types() {
    return []
  }

  get entities() {
    return []
  }

  get bigBrother() {
    return getBigBrotherSpan(this, this._spanContainer.topLevel())
  }
}
