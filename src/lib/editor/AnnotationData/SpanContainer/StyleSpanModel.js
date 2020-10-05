import SpanModel from './SpanModel'

export default class StyleSpanModel extends SpanModel {
  constructor(editor, span, spanContainer, style) {
    super(editor, span, spanContainer)
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
