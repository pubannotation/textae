import delegate from 'delegate'
import EditorDialog from '../dialog/EditorDialog'
import { wholeTemplate } from './tepmlate'
import observeEnterKeyPress from './observeEnterKeyPress'
import observeAddAttributeButton from './observeAddAttributeButton'
import observeRemoveAttributeButton from './observeRemoveAttributeButton'
import getValues from './getValues'

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

function observeDuplicatedPredicateValidation(element) {
  delegate(
    element,
    '.textae-editor__edit-type-dialog__attribute__predicate__value',
    'input',
    () => validateDuplicatedPredicate(element)
  )

  new MutationObserver(() => validateDuplicatedPredicate(element)).observe(
    element,
    {
      childList: true,
      subtree: true
    }
  )
}

function validateDuplicatedPredicate(element) {
  const { attributes } = getValues(element)
  if (attributes.length < 2) {
    valid(element)
    return
  }

  let prevValue = undefined
  for (const input of attributes) {
    if (prevValue !== undefined) {
      if (prevValue !== input.pred) {
        valid(element)
        return
      }
    }
    prevValue = input.pred
  }

  invalid(element)
}

function valid(element) {
  getOkButton(element).removeAttribute('disabled')
  getMessage(element).classList.add(
    'textae-editor__edit-type-dialog__attribute__message--valid'
  )
}

function invalid(element) {
  getOkButton(element).setAttribute('disabled', 'dsiabled')
  getMessage(element).classList.remove(
    'textae-editor__edit-type-dialog__attribute__message--valid'
  )
}
function getOkButton(element) {
  return element
    .closest('.ui-dialog')
    .querySelector('.textae-editor__edit-type-dialog__ok-button')
}

function getMessage(element) {
  return element.querySelector(
    '.textae-editor__edit-type-dialog__attribute__message'
  )
}
