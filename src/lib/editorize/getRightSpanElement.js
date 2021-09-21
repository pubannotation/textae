import getRightElement from './getRightElement'

export default function (editor, spanId) {
  return getRightElement(
    editor[0],
    document.querySelector(`#${spanId}`),
    'textae-editor__span'
  )
}
