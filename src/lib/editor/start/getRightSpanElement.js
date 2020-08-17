import getRightElement from './getRightElement'

export default function(editorDom, spanId) {
  return getRightElement(
    editorDom,
    document.querySelector(`#${spanId}`),
    'textae-editor__span'
  )
}
