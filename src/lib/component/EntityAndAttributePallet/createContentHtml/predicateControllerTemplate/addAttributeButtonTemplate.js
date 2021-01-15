export default function (context) {
  const { isEntityWithSamePredSelected } = context

  return isEntityWithSamePredSelected
    ? `
      <button
        type="button"
        class="textae-editor__type-pallet__add-attribute"
        disabled="disabled"
        >add to</button>
      `
    : `
      <button
        type="button"
        class="textae-editor__type-pallet__add-attribute"
        >add to</button>
      `
}
