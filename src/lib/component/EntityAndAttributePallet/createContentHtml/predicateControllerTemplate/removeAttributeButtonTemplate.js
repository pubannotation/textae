export default function (context) {
  const { isEntityWithSamePredSelected } = context

  return isEntityWithSamePredSelected
    ? `
      <button
        type="button"
        class="textae-editor__type-pallet__remove-attribute"
        >remove from</button>
      `
    : `
      <button
        type="button"
        class="textae-editor__type-pallet__remove-attribute"
        disabled="disabled"
        title="None of the selected items has this attribute."
        >remove from</button>
      `
}
