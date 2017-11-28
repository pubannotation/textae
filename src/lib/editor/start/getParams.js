export default function(element) {
  const params = new Map()

  getAttribute(params, element, 'mode')
  getAttribute(params, element, 'control')
  getAttribute(params, element, 'status_bar')
  getAttribute(params, element, 'config')
  getAttribute(params, element, 'configuration__edit')
  getAttribute(params, element, 'autocompletion_ws')

  // Decode URI encode
  decodeUrl(params, 'config')
  decodeUrl(params, 'autocompletion_ws')

  // Set annotation parameters.
  params.set('source', getSource(element))
  params.set('annotation', getAnnotation(element, params.get('source')))

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

function getAnnotation(element, source) {
  const annotation = new Map()

  // Read Html text and clear it.
  const inlineAnnotation = element.innerText
  element.innerHTML = ''
  if (inlineAnnotation) {
    annotation.set('inlineAnnotation', inlineAnnotation)
  }

  // Read url.
  const url = getUrl(source)
  if (url) {
    annotation.set('url', url)
  }

  // Read save_to
  const saveTo = getSaveToUrl(element)
  if (saveTo) {
    annotation.set('save_to', getSaveToUrl(element))
  }

  if (!inlineAnnotation && !url) {
    let defaultText = '{"text": "Currently, the document is empty. Use the `import` button or press the key `i` to open a document with annotation."}'
    annotation.set('inlineAnnotation', defaultText)
  }

  return annotation
}

function getSource(element) {
  // 'source' prefer to 'target'
  return element.getAttribute('source') || element.getAttribute('target')
}

function getUrl(source) {
  if (source) {
    return decodeURIComponent(source)
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
