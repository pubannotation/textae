import EditorDialog from '../dialog/EditorDialog'
import { wholeTemplate } from './tepmlate'
import observeEnterKeyPress from './observeEnterKeyPress'
import observeAddAttributeButton from './observeAddAttributeButton'
import observeRemoveAttributeButton from './observeRemoveAttributeButton'
import getValues from './getValues'
import observeDuplicatedPredicateValidation from './observeDuplicatedPredicateValidation'

export default function(type, done) {
  const el = document.createElement('div')
  el.innerHTML = wholeTemplate({
    value: type.name,
    attributes: type.attributes
  })

  const onOk = (content) => {
    const { typeName, label, attributes } = getValues(content)
    done(typeName, label, attributes)
    $dialog.close()
  }

  // Create a dialog
  const $dialog = new EditorDialog(
    'textae.dialog.edit-id',
    'Please edit type and attributes',
    el.children[0],
    {
      noCancelButton: true,
      buttons: [
        {
          text: 'OK',
          class: 'textae-editor__edit-type-dialog__ok-button',
          click() {
            onOk(this)
          }
        }
      ],
      width: 800
    }
  )

  observeAddAttributeButton($dialog[0])
  observeRemoveAttributeButton($dialog[0])
  observeDuplicatedPredicateValidation($dialog[0])
  observeEnterKeyPress($dialog, onOk)

  return $dialog
}
