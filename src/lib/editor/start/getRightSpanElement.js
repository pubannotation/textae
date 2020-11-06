import getRightElement from './getRightElement'

export default function (editor, spanId) {
  return getRightElement(
    editor,
    document.querySelector(`#${spanId}`),
    'textae-editor__span'
  )
}
