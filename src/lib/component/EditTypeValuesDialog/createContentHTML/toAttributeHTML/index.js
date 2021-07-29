export default function (
  attribute,
  index,
  attributeInstances,
  attributeContainer
) {
  const { pred, obj } = attribute
  const previousAttribute = attributeInstances[index - 1]
  const previousPredicate = previousAttribute && previousAttribute.pred
  const definitionIndex = attributeContainer.getIndexOf(pred)
  const { valueType } = attributeContainer.get(pred)

  return `
<tr class="textae-editor__edit-type-dialog__attribute">
  ${
    pred === previousPredicate
      ? `<td></td>`
      : `<td>
          ${
            definitionIndex < 9
              ? `<span class="textae-editor__edit-type-dialog__shortcut-key" title="Shotcut key for this predicate">${
                  definitionIndex + 1
                }</span>`
              : ''
          }
        </td>
        `
  }
  <td>
    <span
      class="textae-editor__edit-type-dialog__attribute__predicate__value ${
        pred === previousPredicate
          ? ''
          : `textae-editor__edit-type-dialog__attribute__predicate__value--${valueType}`
      }"
      data-pred="${pred}">
      ${pred === previousPredicate ? '' : pred}
    </span>
  </td>
  <td>
    <span class="textae-editor__edit-type-dialog__attribute__value__value">${obj}</span>
  </td>
  <td>
    <span class="textae-editor__edit-type-dialog__attribute__label__value">
      ${getLabelOf(attribute, attributeContainer)}
    </span>
  </td>
  <td>
    <button
      type="button"
      class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__edit__value" data-pred="${pred}"
      data-index="${index}"
      ${valueType === 'flag' ? 'disabled="disabled"' : ''}>
    </button>
    <button
      type="button" 
      class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__remove__value" 
      data-index="${index}">
    </button>
  </td>
</tr>`
}

function getLabelOf(attribute, attributeContainer) {
  const { pred, obj } = attribute
  const { valueType } = attributeContainer.get(pred)

  switch (valueType) {
    case 'string':
      // In the case of String attributes,
      // Labels completed by autocomplete can be reflected in attribute definitions.
      // We want to keep the label in the attribute hash until we press the OK button.
      return attribute.label || attributeContainer.getLabel(pred, obj) || ''
    case 'selection':
      // In the case of Selection attributes,
      // we want to refer only to the label of the attribute definition.
      return attributeContainer.getLabel(pred, obj) || ''
    case 'numeric':
    case 'flag':
      // No label for numric attributes or for flag attributes.
      return ''
    default:
      throw `unknown attribute type: ${valueType}`
  }
}
