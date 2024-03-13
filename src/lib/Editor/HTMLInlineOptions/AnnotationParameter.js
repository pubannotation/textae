export default class AnnotationParameter {
  #annotation
  #sourceURL

  constructor(element, sourceURL) {
    this.#loadAnnotationFrom(element)

    // Read url.
    if (sourceURL) {
      this.#sourceURL = decodeURIComponent(sourceURL)
    }
  }

  get isLoaded() {
    return Boolean(this.#annotation)
  }

  get annotation() {
    return JSON.parse(this.#annotation)
  }

  get isRemote() {
    // Inline annotation is prioritized.
    if (this.isLoaded) {
      return false
    }

    return Boolean(this.#sourceURL)
  }

  get URL() {
    return this.#sourceURL
  }

  #loadAnnotationFrom(element) {
    // Use textContent instead of innerText,
    // to read consecutive whitespace in inline annotations without collapsing.
    const inlineAnnotation = element.textContent
    element.innerHTML = ''
    if (inlineAnnotation) {
      this.#annotation = inlineAnnotation
    }
  }
}
