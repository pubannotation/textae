import SpanModel from './SpanModel'

export default class StyleSpanModel extends SpanModel {
  constructor(editor, begin, end, spanModelContainer, style) {
    super(editor.editorID, editor[0], begin, end, spanModelContainer, style)
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
        title="${this.title}"
        class="${this._styleClasses.join(' ')}"
        >
      </span>
    `
  }
}
