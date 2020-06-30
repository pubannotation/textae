import idFactory from '../../../idFactory'

export default class {
  constructor(editor, span) {
    this._editor = editor
    this._span = span
    this.styles = new Set()
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
}
