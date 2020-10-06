import getSpan from './getSpan'

export default class {
  constructor(editor) {
    this._editor = editor

    // The cache for span positions.
    // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
    // This cache is big effective for the initiation, and little effective for resize.
    this._spanCache = new Map()
  }

  cacheAllSpan(spans) {
    for (const span of spans) {
      this.getSpan(span.id)
    }
  }

  getSpan(spanId) {
    if (!this._spanCache.has(spanId)) {
      this._spanCache.set(spanId, getSpan(this._editor, spanId))
    }

    return this._spanCache.get(spanId)
  }

  removeAllSpan() {
    this._spanCache.clear()
  }
}
