import anemone from '../../../anemone'
import toDeleteButton from './toDeleteButton'

export default function (context) {
  const { isLock, numberOfItemsUsingSelectedPred } = context

  if (isLock) {
    return () => `
      <button
        type="button"
        class="textae-editor__pallet__table-button textae-editor__pallet__table-button--disabled textae-editor__pallet__edit-predicate"
        disabled="disabled">
      </button>
      <button
        type="button"
        class="textae-editor__pallet__table-button textae-editor__pallet__table-button--disabled textae-editor__pallet__delete-predicate"
        disabled="disabled">
      </button>
    `
  }

  return () => anemone`
    <button
      type="button"
      class="textae-editor__pallet__table-button textae-editor__pallet__edit-predicate"
      title="Edit this predicate.">
    </button>
    ${toDeleteButton(numberOfItemsUsingSelectedPred)}
  `
}
