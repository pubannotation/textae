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
        >remove from</button>
      `
}
