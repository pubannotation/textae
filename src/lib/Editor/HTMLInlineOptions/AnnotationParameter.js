export default class AnnotationParameter {
  #inlineAnnotation
  #url

  constructor(element, source) {
    this.#readAndClearInlineAnnotation(element)

    // Read url.
    if (source) {
      this.#url = decodeURIComponent(source)
    }
  }

  get isInline() {
    return Boolean(this.#inlineAnnotation)
  }

  get inlineAnnotation() {
    return JSON.parse(this.#inlineAnnotation)
  }

  get isRemote() {
    return Boolean(this.#url)
  }

  get URL() {
    return this.#url
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
