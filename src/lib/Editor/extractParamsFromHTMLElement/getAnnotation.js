import getSaveToUrl from './getSaveToUrl'
import getUrl from './getUrl'

class AnnotationParameter {
  constructor() {
    this._map = new Map()
  }

  has(key) {
    return this._map.has(key)
  }

  get(key) {
    return this._map.get(key)
  }

  set(key, value) {
    this._map.set(key, value)
  }
}

export default function (element, source) {
  const annotation = new AnnotationParameter()

  // Read Html text and clear it.
  // Use textContent instead of innerText,
  // to read consecutive whitespace in inline annotations without collapsing.
  const inlineAnnotation = element.textContent
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

  return annotation
}
