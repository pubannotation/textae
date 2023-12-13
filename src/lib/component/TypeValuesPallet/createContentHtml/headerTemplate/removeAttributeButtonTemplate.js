import anemone from '../../../anemone'

export default function (context) {
  const { selectionModelItems, selectedPred } = context
  const isEntityWithSamePredSelected =
    selectionModelItems.selectedWithAttributeOf(selectedPred)

  return () =>
    isEntityWithSamePredSelected
      ? anemone`
      <button
        type="button"
        class="textae-editor__pallet__remove-attribute"
        >remove from</button>
      `
      : anemone`
      <button
        type="button"
        class="textae-editor__pallet__remove-attribute"
        disabled="disabled"
        title="None of the selected items has this attribute."
        >remove from</button>
      `
}
