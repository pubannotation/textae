export default function (context) {
  const { hasInstance } = context.attrDef

  return `
  ${
    hasInstance
      ? `<button 
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__table-button--disabled textae-editor__type-pallet__delete-predicate"
          disabled="disabled"
          title="Attribute definitions with instances cannot be deleted.">
        </button>`
      : `<button
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__delete-predicate">
        </button>`
  }
  <button
    type="button"
    class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-predicate"
    title="Edit this predicate.">
  </button>
`
}
