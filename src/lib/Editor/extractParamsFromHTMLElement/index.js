import getSource from './getSource'
import getAnnotation from './getAnnotation'
import decodeUrl from './decodeUrl'
import getAttribute from './getAttribute'

export default function (element) {
  const params = new Map()

  getAttribute(params, element, 'mode')
  getAttribute(params, element, 'control')
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

  if (params.get('control') === 'visible') {
    element.classList.add('textae-editor--control-visible')
  }

  if (
    params.get('control') === 'hidden' ||
    (params.get('mode') === 'view' && params.get('control') !== 'visible')
  ) {
    element.classList.add('textae-editor--control-hidden')
  }

  return params
}
