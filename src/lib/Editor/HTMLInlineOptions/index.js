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

  get annotationParameter() {
    return this.#annotationParameter
  }

  get autocompletionWS() {
    return this.#readAttributeAsURL('autocompletion_ws')
  }

  get config() {
    return this.#readAttributeAsURL('config')
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

    return this.#readAttribute('config_lock')
  }

  get control() {
    return this.#readAttribute('control')
  }

  get inspect() {
    return this.#readAttribute('inspect')
  }

  /**
   * @returns {boolean}
   */
  get isEditMode() {
    switch (this.#readAttribute('mode')) {
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
      this.#readAttribute('mode') === 'edit' ||
      this.#readAttribute('mode') === 'term-edit'
    )
  }

  get isBlockEditMode() {
    return this.#readAttribute('mode') === 'block-edit'
  }

  get isRelationEditMode() {
    return this.#readAttribute('mode') === 'relation-edit'
  }

  get statusBar() {
    return this.#readAttribute('status_bar')
  }

  get saveTo() {
    return this.#readAttributeAsURL('save_to')
  }

  get isFocusFirstDenotation() {
    const isFocusFirstDenotation =
      this.#readAttribute('focus_first_denotation') === 'true'

    if (isFocusFirstDenotation && this.isEditMode) {
      throw new Error('focus_first_denotation is only available in view mode.')
    }

    return isFocusFirstDenotation
  }

  get additionalPaddingTop() {
    return this.#readAttribute('padding_top')
      ? parseInt(this.#readAttribute('padding_top'), 10)
      : 0
  }

  get #source() {
    return this.#readAttribute('source') || this.#readAttribute('target')
  }

  #readAttribute(name) {
    if (this.#element.hasAttribute(name)) {
      return this.#element.getAttribute(name)
    }

    return null
  }

  #readAttributeAsURL(name) {
    if (this.#element.hasAttribute(name)) {
      return decodeURIComponent(this.#element.getAttribute(name))
    }

    return null
  }
}
