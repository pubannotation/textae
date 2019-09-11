import delegate from 'delegate'

export default function(element) {
  // Observe remove an attributu button
  delegate(
    element,
    '.textae-editor__edit-type-dialog__attribute__remove__value',
    'click',
    (e) => {
      const attribute = e.target.closest(
        '.textae-editor__edit-type-dialog__attribute'
      )
      attribute.parentElement.removeChild(attribute)
    }
  )
}
