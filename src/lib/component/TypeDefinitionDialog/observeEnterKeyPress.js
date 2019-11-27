import delegate from 'delegate'

export default function(el, okHandler) {
  delegate(
    el,
    `.textae-editor__edit-type-definition-dialog--id`,
    'keyup',
    (e) => {
      if (e.key === 'Enter') {
        okHandler()
      }
    }
  )
}
