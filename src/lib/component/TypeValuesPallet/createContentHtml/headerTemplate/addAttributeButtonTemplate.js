export default function (context) {
  const { selectionModelItems, selectedPred } = context
  const isEntityWithoutSamePredSelected =
    selectionModelItems.selectedWithoutAttributeOf(selectedPred)

  return isEntityWithoutSamePredSelected
    ? `
      <button
        type="button"
        class="textae-editor__pallet__add-attribute"
        >add to</button>
      `
    : `
      <button
        type="button"
        class="textae-editor__pallet__add-attribute"
        disabled="disabled"
        title="All the selected items already have this attribute."
        >add to</button>
      `
}
