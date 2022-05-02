import AnnotationParameter from './AnnotationParameter'
import getConfigLockFromURL from './getConfigLockFromURL'

export default function (element) {
  const params = new Map()
  const source =
    element.getAttribute('source') || element.getAttribute('target')

  // Set annotation parameters.
  params.set('annotation', new AnnotationParameter(element, source))

  getURLAttribute(params, element, 'autocompletion_ws')
  getURLAttribute(params, element, 'config')

  getAttribute(params, element, 'mode')
  if (element.getAttribute('control')) {
    const controlParam = element.getAttribute('control')
    if (controlParam === 'visible') {
      element.classList.add('textae-editor--control-visible')
    }
    if (
      controlParam === 'hidden' ||
      (params.get('mode') === 'view' && controlParam !== 'visible')
    ) {
      element.classList.add('textae-editor--control-hidden')
    }
  }

  getAttribute(params, element, 'status_bar')

  getURLAttribute(params, element, 'save_to')

  // Over write editor-div's config lock state by url's.
  // Url's default is 'unlock', so its default is also 'unlock'.
  const configLockFromAttr = element.getAttribute('config_lock')
  const configLockFromURL = getConfigLockFromURL(source)
  if (configLockFromURL || configLockFromAttr) {
    params.set('config_lock', configLockFromURL || configLockFromAttr)
  }

  return params
}

function getAttribute(params, element, name) {
  if (element.hasAttribute(name)) {
    params.set(name, element.getAttribute(name))
  }
}

function getURLAttribute(params, element, name) {
  if (element.hasAttribute(name)) {
    params.set(name, decodeURIComponent(element.getAttribute(name)))
  }
}
