export default class AnnotationParameter {
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

  get isInline() {
    return Boolean(this._inlineAnnotation)
  }

  get inlineAnnotation() {
    return JSON.parse(this._inlineAnnotation)
  }

  get isRemote() {
    return Boolean(this._url)
  }

  get URL() {
    return this._url
  }
}
