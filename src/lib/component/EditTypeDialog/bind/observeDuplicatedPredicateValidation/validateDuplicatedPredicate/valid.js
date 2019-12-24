import getMessage from './invalid/getMessage'
import getOkButton from './invalid/getOkButton'

export default function(element) {
  getOkButton(element).removeAttribute('disabled')
  getMessage(element).classList.add(
    'textae-editor__edit-type-dialog__attribute__message--valid'
  )
}
