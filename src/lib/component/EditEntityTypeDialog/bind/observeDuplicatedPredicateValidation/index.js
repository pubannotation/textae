import delegate from 'delegate'
import validateDuplicatedPredicate from './validateDuplicatedPredicate'

export default function(element) {
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
