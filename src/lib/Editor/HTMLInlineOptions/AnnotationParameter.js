export default class AnnotationParameter {
  #inlineAnnotation
  #sourceURL

  constructor(element, sourceURL) {
    this.#readAndClearInlineAnnotation(element)

    // Read url.
    if (sourceURL) {
      this.#sourceURL = decodeURIComponent(sourceURL)
    }
  }

  get isInline() {
    return Boolean(this.#inlineAnnotation)
  }

  get inlineAnnotation() {
    return JSON.parse(this.#inlineAnnotation)
  }

  get isRemote() {
    // Inline annotation is prioritized.
    if (this.isInline) {
      return false
    }

    return Boolean(this.#sourceURL)
  }

  get URL() {
    return this.#sourceURL
  }

  #readAndClearInlineAnnotation(element) {
    // Use textContent instead of innerText,
    // to read consecutive whitespace in inline annotations without collapsing.
    const inlineAnnotation = element.textContent
    element.innerHTML = ''
    if (inlineAnnotation) {
      this.#inlineAnnotation = inlineAnnotation
    }
  }
}
