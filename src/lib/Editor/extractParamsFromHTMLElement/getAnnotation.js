class AnnotationParameter {
  constructor(element, source) {
    this._map = new Map()

    // Read Html text and clear it.
    // Use textContent instead of innerText,
    // to read consecutive whitespace in inline annotations without collapsing.
    const inlineAnnotation = element.textContent
    element.innerHTML = ''
    if (inlineAnnotation) {
      this._inlineAnnotation = inlineAnnotation
    }

    // Read url.
    if (source) {
      this._url = decodeURIComponent(source)
    }
  }

  has(key) {
    return this._map.has(key)
  }

  get(key) {
    return this._map.get(key)
  }

  set(key, value) {
    this._map.set(key, value)
  }

  get hasInlineAnnotation() {
    return Boolean(this._inlineAnnotation)
  }

  get inlineAnnotation() {
    return this._inlineAnnotation
  }

  get hasURL() {
    return Boolean(this._url)
  }

  get URL() {
    return this._url
  }
}

export default function (element, source) {
  const annotation = new AnnotationParameter(element, source)

  // Read save_to
  if (element.hasAttribute('save_to')) {
    annotation.set(
      'save_to',
      decodeURIComponent(element.getAttribute('save_to'))
    )
  }

  return annotation
}
