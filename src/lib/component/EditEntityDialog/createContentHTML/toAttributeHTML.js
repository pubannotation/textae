export default function (attribute, attributeContainer, previousAttribute) {
  const { pred, obj } = attribute
  const previousPredicate = previousAttribute && previousAttribute.pred
  const editDisabled = attributeContainer.get(pred).valueType === 'flag'

  return `
<tr class="textae-editor__edit-type-dialog__attribute">
  <td>
    <span class="textae-editor__edit-type-dialog__attribute__predicate__value">${
      pred === previousPredicate ? '' : pred
    }</span>
  </td>
  <td>
    <span class="textae-editor__edit-type-dialog__attribute__value__value">${obj}</span>
  </td>
  <td>
  </td>
  <td>
    <button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__edit__value" data-predicate="${pred}"${
    editDisabled ? 'disabled="disabled"' : ''
  }></button>
    <button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__remove__value"></button>
  </td>
</tr>`
}
