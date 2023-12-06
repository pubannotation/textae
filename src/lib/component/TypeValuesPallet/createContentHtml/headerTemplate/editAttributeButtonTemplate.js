import anemone from '../../../anemone'

export default function (context) {
  const { attrDef, selectionModelItems, selectedPred } = context
  const { valueType } = attrDef
  const isOnlyEntityWithJustOneSamePredSelected =
    selectionModelItems.onlySelectedWithJustOneAttributeOf(selectedPred)

  return valueType === 'string' || valueType === 'numeric'
    ? isOnlyEntityWithJustOneSamePredSelected
      ? anemone`
        <button
          type="button"
          class="textae-editor__pallet__edit-object"
          >edit object of
        </button>
        `
      : anemone`
        <button
          type="button"
          class="textae-editor__pallet__edit-object"
          disabled="disabled"
          title="Some selected items has zero or multi this attribute."
          >edit object of
        </button>
      `
    : ``
}
