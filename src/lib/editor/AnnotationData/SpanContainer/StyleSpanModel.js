import SpanModel from './SpanModel'

export default class StyleSpanModel extends SpanModel {
  constructor(editor, begin, end, spanContainer, style) {
    super(editor, begin, end, spanContainer)
    this.styles = new Set([style])
  }

  // Mark it not to be rendered as a span.
  get styleOnly() {
    return true
  }

  appendStyles(styles) {
    this.styles = new Set([...this.styles, ...styles])
  }

  get _contentHTML() {
    return `
      <span
        id="${this.id}"
        title="${this.id}"
        class="${this._styleClasses.join(' ')}"
        >
      </span>
    `
  }
}
