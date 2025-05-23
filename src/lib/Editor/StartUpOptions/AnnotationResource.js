import isJSON from '../../isJSON'
import SimpleInlineTextAnnotation from '@pubann/simple-inline-text-annotation'

export default class AnnotationResource {
  #annotation
  #sourceURL

  constructor(element, sourceURL, annotationFromQueryParameter) {
    if (annotationFromQueryParameter) {
      this.#annotation = annotationFromQueryParameter
    } else if (sourceURL) {
      this.#sourceURL = sourceURL
    } else {
      // Read annotation from inline annotation.
      const inlineAnnotation = this.#deconstructInlineAnnotation(element)
      if (inlineAnnotation) {
        this.#annotation = inlineAnnotation
      }
    }
  }

  get isLoaded() {
    return Boolean(this.#annotation)
  }

  get isRemote() {
    return Boolean(this.#sourceURL)
  }

  get URL() {
    return this.#sourceURL
  }

  annotation() {
    try {
      if (isJSON(this.#annotation)) {
        return JSON.parse(this.#annotation)
      } else {
        return SimpleInlineTextAnnotation.parse(this.#annotation)
      }
    } catch {
      return null
    }
  }

  #deconstructInlineAnnotation(element) {
    // Use textContent instead of innerText,
    // to read consecutive whitespace in inline annotations without collapsing.
    const inlineAnnotation = element.textContent
    element.innerHTML = ''
    return inlineAnnotation
  }
}
