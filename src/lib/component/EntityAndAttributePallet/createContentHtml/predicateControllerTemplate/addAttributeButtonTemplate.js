export default function (context) {
  const { isEntityWithoutSamePredSelected } = context

  return isEntityWithoutSamePredSelected
    ? `
      <button
        type="button"
        class="textae-editor__type-pallet__add-attribute"
        >add to</button>
      `
    : `
      <button
        type="button"
        class="textae-editor__type-pallet__add-attribute"
        disabled="disabled"
        title="All the selected items already have this attribute."
        >add to</button>
      `
}
