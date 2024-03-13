export default class AnnotationParameter {
  #annotation
  #sourceURL

  constructor(element, sourceURL) {
    const inlineAnnotation = this.#deconstructInlineAnnotation(element)
    if (inlineAnnotation) {
      // Read annotation from inline annotation.
      this.#annotation = inlineAnnotation
    } else if (sourceURL == 'query_parameter') {
      // Read annotation from query parameter.
      const params = new URLSearchParams(window.location.search)
      if (params.get('annotation') != null) {
        this.#annotation = decodeURIComponent(params.get('annotation'))
      }

      // Clear sourceURL to avoid loading remote annotation.
      this.#sourceURL = null
    } else if (sourceURL) {
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

  #deconstructInlineAnnotation(element) {
    // Use textContent instead of innerText,
    // to read consecutive whitespace in inline annotations without collapsing.
    const inlineAnnotation = element.textContent
    element.innerHTML = ''
    return inlineAnnotation
  }
}
