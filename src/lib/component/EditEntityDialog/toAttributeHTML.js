export default function (attribute, attributeContainer) {
  const { pred, obj } = attribute
  const editDisabled = attributeContainer.get(pred).valueType === 'flag'

  return `
<tr class="textae-editor__edit-type-dialog__attribute">
  <td>
    <input class="textae-editor__edit-type-dialog__attribute__predicate__value" value="${pred}" disabled="disabled">
  </td>
  <td>
    <input class="textae-editor__edit-type-dialog__attribute__value__value" value="${obj}" disabled="disabled">
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
