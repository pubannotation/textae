import getMessage from './getMessage'
import getOkButton from './getOkButton'

export default function(element) {
  getOkButton(element).setAttribute('disabled', 'dsiabled')
  getMessage(element).classList.remove(
    'textae-editor__edit-type-dialog__attribute__message--valid'
  )
}
