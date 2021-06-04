export default function (context) {
  const { isLock, numberOfItemsUsingSelectedPred } = context

  if (isLock) {
    return `
      <button
        type="button"
        class="textae-editor__type-pallet__table-button textae-editor__type-pallet__table-button--disabled textae-editor__type-pallet__edit-predicate"
        disabled="disabled">
      </button>
      <button 
        type="button"
        class="textae-editor__type-pallet__table-button textae-editor__type-pallet__table-button--disabled textae-editor__type-pallet__delete-predicate"
        disabled="disabled">
      </button>
    `
  }

  return `
    <button
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-predicate"
      title="Edit this predicate.">
    </button>
    ${
      numberOfItemsUsingSelectedPred.size > 0
        ? `<button 
            type="button"
            class="textae-editor__type-pallet__table-button textae-editor__type-pallet__table-button--disabled textae-editor__type-pallet__delete-predicate"
            disabled="disabled"
            title="It cannot be deleted, as this attribute is used for ${numberOfItemsUsingSelectedPred.size} items.">
          </button>`
        : `<button
            type="button"
            class="textae-editor__type-pallet__table-button textae-editor__type-pallet__delete-predicate"
            title="Delet this predicate.">
          </button>`
    }
  `
}
