import anemone from '../../../anemone'

export default function toDeleteButton(numberOfItemsUsingSelectedPred) {
  return () =>
    numberOfItemsUsingSelectedPred.size > 0
      ? anemone`<button
            type="button"
            class="textae-editor__pallet__table-button textae-editor__pallet__table-button--disabled textae-editor__pallet__delete-predicate"
            disabled="disabled"
            title="It cannot be deleted, as this attribute is used for ${numberOfItemsUsingSelectedPred.size} items.">
          </button>`
      : anemone`<button
            type="button"
            class="textae-editor__pallet__table-button textae-editor__pallet__delete-predicate"
            title="Delete this predicate.">
          </button>`
}
