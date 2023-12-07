import AnnotationParameter from './AnnotationParameter'

export default class HTMLInlineOptions {
  constructor(element) {
    this._element = element

    // Reading inline annotations is a destructive operation, so it is done in the constructor.
    this._annotationParameter = new AnnotationParameter(
      this._element,
      this._source
    )
  }

  get annotation() {
    return this._annotationParameter
  }

  get autocompletionWS() {
    return this._readURLAttribute('autocompletion_ws')
  }

  get config() {
    return this._readURLAttribute('config')
  }

  get configLock() {
    // Over write editor-div's config lock state by url's.
    // Url's default is 'unlock', so its default is also 'unlock'.
    if (this._source) {
      const searchParams = new URLSearchParams(this._source.split('?')[1])

      if (searchParams.has('config_lock')) {
        return searchParams.get('config_lock')
      }
    }

    return this._element.getAttribute('config_lock')
  }

  get control() {
    return this._element.getAttribute('control')
  }

  get inspect() {
    return this._element.getAttribute('inspect')
  }

  /**
   * @returns {boolean}
   */
  get isEditMode() {
    switch (this._element.getAttribute('mode')) {
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
      this._element.getAttribute('mode') === 'edit' ||
      this._element.getAttribute('mode') === 'term-edit'
    )
  }

  get isBlockEditMode() {
    return this._element.getAttribute('mode') === 'block-edit'
  }

  get isRelationEditMode() {
    return this._element.getAttribute('mode') === 'relation-edit'
  }

  get statusBar() {
    return this._element.getAttribute('status_bar')
  }

  get saveTo() {
    return this._readURLAttribute('save_to')
  }

  get _source() {
    return (
      this._element.getAttribute('source') ||
      this._element.getAttribute('target')
    )
  }

  _readURLAttribute(name) {
    if (this._element.hasAttribute(name)) {
      return decodeURIComponent(this._element.getAttribute(name))
    }

    return null
  }
}
