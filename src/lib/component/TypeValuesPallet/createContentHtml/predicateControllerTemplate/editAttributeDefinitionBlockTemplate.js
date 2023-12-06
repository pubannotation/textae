import anemone from '../../../anemone'

export default function (context) {
  const { isLock, numberOfItemsUsingSelectedPred } = context

  if (isLock) {
    return anemone`
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

  return anemone`
    <button
      type="button"
      class="textae-editor__pallet__table-button textae-editor__pallet__edit-predicate"
      title="Edit this predicate.">
    </button>
    ${() =>
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
          </button>`}
  `
}
