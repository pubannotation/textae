import getUrlParameters from './getUrlParameters'

export default function(editor) {
  // Read model parameters from url parameters and html attributes.
  const params = getUrlParameters(location.search)

  // 'source' prefer to 'target'
  params.target = editor.attr('source') || editor.attr('target') || params.source || params.target

  priorAttr(params, editor, 'config')
  priorAttr(params, editor, 'status_bar')

  // Mode is prior in the url parameter.
  priorUrl(params, editor, 'mode')

  // Decode URI encode
  urlDecode(params, 'config')
  urlDecode(params, 'target')
  urlDecode(params, 'autocompletion_ws')

  // Read Html text and clear it.
  const inlineAnnotation = editor.text()
  editor.empty()

  // Set annotaiton parameters.
  params.annotation = {
    inlineAnnotation: inlineAnnotation,
    url: params.target
  }

  return params
}

function priorUrl(params, editor, name) {
  if (!params[name] && editor.attr(name)) {
    params[name] = editor.attr(name)
  }
}

function priorAttr(params, editor, name) {
  if (editor.attr(name)) {
    params[name] = editor.attr(name)
  }
}

function urlDecode(params, name) {
  if (params[name]) {
    params[name] = decodeURIComponent(params[name])
  }
}
