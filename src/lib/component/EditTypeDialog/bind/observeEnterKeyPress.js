import delegate from 'delegate'

export default function(element, onOk) {
  // Observe enter key press
  delegate(
    element,
    '.textae-editor__edit-type-dialog__type__value__value',
    'keyup',
    (e) => {
      if (e.keyCode === 13) {
        onOk(e.currentTarget)
      }
    }
  )
}
