import AnnotationParameter from './AnnotationParameter'

export default class ParamsFormHTMLElement {
  constructor(element) {
    this._element = element
  }

  get params() {
    const ret = new Map()
    const source =
      this._element.getAttribute('source') ||
      this._element.getAttribute('target')

    // Set annotation parameters.
    ret.set('annotation', new AnnotationParameter(this._element, source))

    this._readURLAttribute(ret, 'autocompletion_ws')
    this._readURLAttribute(ret, 'config')

    // Over write editor-div's config lock state by url's.
    // Url's default is 'unlock', so its default is also 'unlock'.
    const configLockFromAttr = this._element.getAttribute('config_lock')
    const configLockFromURL = getConfigLockFromURL(source)
    if (configLockFromURL || configLockFromAttr) {
      ret.set('config_lock', configLockFromURL || configLockFromAttr)
    }

    if (this._element.getAttribute('control')) {
      const controlParam = this._element.getAttribute('control')
      if (controlParam === 'visible') {
        this._element.classList.add('textae-editor--control-visible')
      }
      if (
        controlParam === 'hidden' ||
        (ret.get('mode') === 'view' && controlParam !== 'visible')
      ) {
        this._element.classList.add('textae-editor--control-hidden')
      }
    }

    this._readAttribute(ret, 'mode')
    this._readAttribute(ret, 'status_bar')
    this._readURLAttribute(ret, 'save_to')

    return ret
  }

  _readURLAttribute(params, name) {
    if (this._element.hasAttribute(name)) {
      params.set(name, decodeURIComponent(this._element.getAttribute(name)))
    }
  }

  _readAttribute(params, name) {
    if (this._element.hasAttribute(name)) {
      params.set(name, this._element.getAttribute(name))
    }
  }
}

function getConfigLockFromURL(source) {
  if (source) {
    const searchParams = new URLSearchParams(source.split('?')[1])

    if (searchParams.has('config_lock')) {
      return searchParams.get('config_lock')
    }
  }
  return null
}
