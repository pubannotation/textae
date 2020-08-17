import { getRightElement } from './getNextElement'

export default function(editorDom, spanId) {
  return getRightElement(
    editorDom,
    document.querySelector(`#${spanId}`),
    'textae-editor__span'
  )
}
