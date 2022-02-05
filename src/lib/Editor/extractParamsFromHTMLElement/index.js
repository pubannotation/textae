import getSource from './getSource'
import getAnnotation from './getAnnotation'
import decodeUrl from './decodeUrl'
import getAttribute from './getAttribute'

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
  getAttribute(params, element, 'config_lock')
  getAttribute(params, element, 'autocompletion_ws')

  // Decode URI encode
  decodeUrl(params, 'config')
  decodeUrl(params, 'autocompletion_ws')

  // Set annotation parameters.
  params.set('source', getSource(element))
  params.set('annotation', getAnnotation(element, params.get('source')))

  return params
}
