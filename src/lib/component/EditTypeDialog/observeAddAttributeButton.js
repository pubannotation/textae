import delegate from 'delegate'
import { attributeTemplate } from './tepmlate'

export default function observeAddAttributeButton(element) {
  // Observe add an attributu button
  delegate(
    element,
    '.textae-editor__edit-type-dialog__attribute__add__value',
    'click',
    (e) =>
      e.target
        .closest('.textae-editor__edit-type-dialog__container')
        .querySelector('.textae-editor__edit-type-dialog__attributes')
        .insertAdjacentHTML('beforeend', attributeTemplate({}))
  )
}
