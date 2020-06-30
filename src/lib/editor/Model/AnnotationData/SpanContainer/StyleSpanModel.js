import SpanModel from './SpanModel'

export default class extends SpanModel {
  constructor(editor, span, style) {
    super(editor, span)
    this.styles = new Set([style])
  }

  // Mark it not to be rendered as a span.
  get styleOnly() {
    return true
  }

  appendStyles(styles) {
    this.styles = new Set([...this.styles, ...styles])
  }
}
