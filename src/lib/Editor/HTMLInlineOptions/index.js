import AnnotationParameter from './AnnotationParameter'

export default class HTMLInlineOptions {
  #element
  #annotationParameter

  constructor(element) {
    this.#element = element

    // Reading inline annotations is a destructive operation, so it is done in the constructor.
    this.#annotationParameter = new AnnotationParameter(
      this.#element,
      this.#source
    )
  }

  get annotation() {
    return this.#annotationParameter
  }

  get autocompletionWS() {
    return this.#readURLAttribute('autocompletion_ws')
  }

  get config() {
    return this.#readURLAttribute('config')
  }

  get configLock() {
    // Over write editor-div's config lock state by url's.
    // Url's default is 'unlock', so its default is also 'unlock'.
    if (this.#source) {
      const searchParams = new URLSearchParams(this.#source.split('?')[1])

      if (searchParams.has('config_lock')) {
        return searchParams.get('config_lock')
      }
    }

    return this.#element.getAttribute('config_lock')
  }

  get control() {
    return this.#element.getAttribute('control')
  }

  get inspect() {
    return this.#element.getAttribute('inspect')
  }

  /**
   * @returns {boolean}
   */
  get isEditMode() {
    switch (this.#element.getAttribute('mode')) {
      case 'edit':
      case 'term-edit':
      case 'block-edit':
      case 'relation-edit':
        return true

      default:
        return false
    }
  }

  get isTermEditMode() {
    // Same as edit mode and term-edit mode for compatibility.
    return (
      this.#element.getAttribute('mode') === 'edit' ||
      this.#element.getAttribute('mode') === 'term-edit'
    )
  }

  get isBlockEditMode() {
    return this.#element.getAttribute('mode') === 'block-edit'
  }

  get isRelationEditMode() {
    return this.#element.getAttribute('mode') === 'relation-edit'
  }

  get statusBar() {
    return this.#element.getAttribute('status_bar')
  }

  get saveTo() {
    return this.#readURLAttribute('save_to')
  }

  get #source() {
    return (
      this.#element.getAttribute('source') ||
      this.#element.getAttribute('target')
    )
  }

  #readURLAttribute(name) {
    if (this.#element.hasAttribute(name)) {
      return decodeURIComponent(this.#element.getAttribute(name))
    }

    return null
  }
}
