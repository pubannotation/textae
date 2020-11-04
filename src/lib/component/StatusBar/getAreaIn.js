import html from './html'

export default function (container) {
  const area = container.querySelector('.textae-editor__footer__message')

  if (area) {
    return area
  }

  // The editor itself has a "white-space: pre" style for processing text that contains a series of whitespace.
  // In this case, HTML line breaks are included in the editor's height calculation.
  // Remove CRLF so that it is not included in the height calculation.
  container.insertAdjacentHTML('beforeend', html.replace(/[\n\r]+/g, ''))
  return container.querySelector('.textae-editor__footer__message')
}
