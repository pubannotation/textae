import getLabelOf from './getLabelOf'

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
      ? `<td class="shortcut-key" rowspan="2"></td>`
      : `<td class="shortcut-key" rowspan="2">
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
</tr>
<tr>
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
  <td>
    <span class="textae-editor__edit-type-dialog__attribute__label__value">
      ${getLabelOf(attribute, attributeContainer)}
    </span>
  </td>
</tr>
`
}
