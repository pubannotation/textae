import getSpan from './getSpan'

// The cache for span positions.
// Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser.
// For example offsetTop property.
// This cache is big effective for the initiation, and little effective for resize.
export default class SpanPositionCache {
  constructor(editor) {
    this._editor = editor
    this._cache = new Map()
  }

  cacheAll(spans) {
    for (const span of spans) {
      this.get(span.id)
    }
  }

  get(spanId) {
    if (!this._cache.has(spanId)) {
      this._cache.set(spanId, getSpan(this._editor, spanId))
    }

    return this._cache.get(spanId)
  }

  clear() {
    this._cache.clear()
  }
}
