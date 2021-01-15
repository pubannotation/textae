export default function (context) {
  const { attrDef, isOnlyEntityWithJsutOneSamePredSelected } = context
  const valueType = attrDef['value type']

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
          >edit object of
        </button>
      `
    : ``
}
