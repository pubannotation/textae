import { RESOURCE_TYPE } from '../RESOURCE_TYPE'
import AnnotationResource from './AnnotationResource'

export default class StartUpOptions {
  #element
  #resource

  constructor(element) {
    this.#element = element

    // Reading inline annotations is a destructive operation, so it is done in the constructor.
    this.#resource = new AnnotationResource(
      this.#element,
      this.#sourceURL,
      this.#annotationFromQueryParameter
    )
  }

  get resourceType() {
    if (this.#annotationFromQueryParameter) {
      return RESOURCE_TYPE.QUERY_PARAMETER
    } else if (this.#resource.isLoaded) {
      return RESOURCE_TYPE.INLINE
    } else if (this.annotationURL) {
      return RESOURCE_TYPE.REMOTE_URL
    }

    return RESOURCE_TYPE.UNKNOWN
  }

  get annotationURL() {
    if (this.#resource.isRemote) {
      return this.#resource.URL
    }

    return null
  }

  get config() {
    return this.#readAttributeAsURL('config')
  }

  get configLock() {
    // Over write editor-div's config lock state by url's.
    // Url's default is 'unlock', so its default is also 'unlock'.
    if (this.#sourceURL) {
      const searchParams = new URLSearchParams(this.#sourceURL.split('?')[1])

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
      case 'text-edit':
        return true

      default:
        return false
    }
  }

  get isEditTermMode() {
    // Same as edit mode and term-edit mode for compatibility.
    return (
      this.#readAttribute('mode') === 'edit' ||
      this.#readAttribute('mode') === 'term-edit'
    )
  }

  get isEditBlockMode() {
    return this.#readAttribute('mode') === 'block-edit'
  }

  get isEditRelationMode() {
    return this.#readAttribute('mode') === 'relation-edit'
  }

  get isTextEditMode() {
    return this.#readAttribute('mode') === 'text-edit'
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

  get #sourceURL() {
    return (
      this.#readAttributeAsURL('source') || this.#readAttributeAsURL('target')
    )
  }

  async annotation() {
    if (this.#resource.isLoaded) {
      try {
        return await this.#resource.annotation()
      } catch {
        return null
      }
    }

    return null
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

  get #annotationFromQueryParameter() {
    if (this.#isIgnoreAnnotationParameter) {
      return null
    }

    const params = new URLSearchParams(window.location.search)
    if (params.has('annotation')) {
      return decodeURIComponent(params.get('annotation'))
    }

    return null
  }

  get #isIgnoreAnnotationParameter() {
    return Boolean(this.#element.getAttribute('ignore_annotation_parameter'))
  }
}
