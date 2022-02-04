import getSaveToUrl from './getSaveToUrl'
import getUrl from './getUrl'

export default function (element, source) {
  const annotation = new Map()

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
