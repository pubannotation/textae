import getRightElement from './getRightElement'

export default function (editorHTMLElement, spanId) {
  return getRightElement(
    editorHTMLElement,
    document.querySelector(`#${spanId}`),
    'textae-editor__span'
  )
}
