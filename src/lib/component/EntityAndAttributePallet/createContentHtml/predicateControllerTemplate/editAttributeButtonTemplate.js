export default function (context) {
  const { attrDef, selectionModelItems, selectedPred } = context
  const { valueType } = attrDef
  const isOnlyEntityWithJsutOneSamePredSelected = selectionModelItems.onlySelectedWithJustOneAttributeOf(
    selectedPred
  )

  return valueType === 'string' || valueType === 'numeric'
    ? isOnlyEntityWithJsutOneSamePredSelected
      ? `
        <button
          type="button"
          class="textae-editor__type-pallet__edit-object"
          >edit object of
        </button>
        `
      : `
        <button
          type="button"
          class="textae-editor__type-pallet__edit-object"
          disabled="disabled"
          title="Some selected items has zero or multi this attribute."
          >edit object of
        </button>
      `
    : ``
}
