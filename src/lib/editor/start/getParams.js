export default function(element) {
  const params = new Map()

  getAttribute(params, element, 'mode')
  getAttribute(params, element, 'control')
  getAttribute(params, element, 'status_bar')
  getAttribute(params, element, 'config')
  getAttribute(params, element, 'autocompletion_ws')

  // Decode URI encode
  decodeUrl(params, 'config')
  decodeUrl(params, 'autocompletion_ws')

  // Set annotaiton parameters.
  params.set('annotation', getAnntation(element))

  return params
}

function getAttribute(params, editor, name) {
  if (editor.getAttribute(name)) {
    params.set(name, editor.getAttribute(name))
  }
}

function decodeUrl(params, name) {
  if (params.has(name)) {
    params.set(name, decodeURIComponent(params.get(name)))
  }
}

function getAnntation(element) {
  const annotaiton = new Map()

  // Read Html text and clear it.
  const inlineAnnotation = element.innerText
  element.innerHTML = ''
  if (inlineAnnotation) {
    annotaiton.set('inlineAnnotation', inlineAnnotation)
  }

  // Read url.
  const url = getUrl(element)
  if (url) {
    annotaiton.set('url', getUrl(element))
  }

  // Read save_to
  const saveTo = getSaveToUrl(element)
  if (saveTo) {
    annotaiton.set('save_to', getSaveToUrl(element))
  }

  return annotaiton
}

function getUrl(element) {
  // 'source' prefer to 'target'
  const value = element.getAttribute('source') || element.getAttribute('target')

  if (value) {
    return decodeURIComponent(value)
  }

  return ''
}

function getSaveToUrl(element) {
  // 'save_to'
  const value = element.getAttribute('save_to')

  if (value) {
    return decodeURIComponent(value)
  }

  return ''
}
