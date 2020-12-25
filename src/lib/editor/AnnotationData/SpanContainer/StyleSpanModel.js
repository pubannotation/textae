import dohtml from 'dohtml'
import createRangeToSpan from './createRangeToSpan'
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

  renderElement() {
    const element = dohtml.create(`
    <span
      id="${this.id}"
      title="${this.id}"
      class="${[...this.styles.values()]
        .map((style) => `textae-editor__style textae-editor__style--${style}`)
        .join(' ')}"
      >
    </span>
    `)

    const targetRange = createRangeToSpan(this)
    targetRange.surroundContents(element)
  }
}
