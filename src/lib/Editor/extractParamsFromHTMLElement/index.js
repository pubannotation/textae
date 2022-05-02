import getAnnotation from './getAnnotation'
import decodeUrl from './decodeUrl'
import getConfigLockFromURL from './getConfigLockFromURL'

export default function (element) {
  const params = new Map()

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
  getAttribute(params, element, 'config')
  getAttribute(params, element, 'autocompletion_ws')

  // Decode URI encode
  decodeUrl(params, 'config')
  decodeUrl(params, 'autocompletion_ws')

  params.set(
    'source',
    element.getAttribute('source') || element.getAttribute('target')
  )

  // Over write editor-div's config lock state by url's.
  // Url's default is 'unlock', so its default is also 'unlock'.
  const configLockFromAttr = element.getAttribute('config_lock')
  const configLockFromURL = getConfigLockFromURL(params.get('source'))
  if (configLockFromURL || configLockFromAttr) {
    params.set('config_lock', configLockFromURL || configLockFromAttr)
  }

  // Set annotation parameters.
  params.set('annotation', getAnnotation(element, params.get('source')))

  return params
}

function getAttribute(params, element, name) {
  if (element.hasAttribute(name)) {
    params.set(name, element.getAttribute(name))
  }
}
