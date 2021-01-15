export default function (context) {
  const { attrDef, isEntityWithSamePredSelected } = context
  const valueType = attrDef['value type']

  return (valueType === 'string' || valueType === 'numeric') &&
    isEntityWithSamePredSelected
    ? `
      <button
        type="button"
        class="textae-editor__type-pallet__edit-object"
        >edit object of</button>
    `
    : ``
}
