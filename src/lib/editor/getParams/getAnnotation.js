import getSaveToUrl from './getSaveToUrl'
import getUrl from './getUrl'

export default function (element, source) {
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

  return annotation
}
