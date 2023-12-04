import { makeStyleSpanHTMLElementID } from '../../idFactory'
import SpanModel from './SpanModel'

export default class StyleSpanModel extends SpanModel {
  constructor(
    editorID,
    editorHTMLElement,
    begin,
    end,
    spanModelContainer,
    style
  ) {
    super(editorID, editorHTMLElement, begin, end, spanModelContainer, style)
    this.styles = new Set([style])
  }

  get id() {
    return makeStyleSpanHTMLElementID(this._editorID, this._begin, this._end)
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
