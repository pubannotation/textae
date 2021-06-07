import escape from 'lodash.escape'

export default function (value, entityContainer) {
  const label = escape(entityContainer.getLabel(value)) || ''

  return `
    <tr>
      <td></td>
      <td>
        <span class="textae-editor__edit-type-dialog__type__predicate__value">type</span>
      </td>
      <td class="ui-front">
        <input class="textae-editor__edit-type-dialog__type__value__value textae-editor__promise-daialog__observable-element" value="${value}">
      </td>
      <td>
        <span class="textae-editor__edit-type-dialog__type__label__value">${label}</span>
      </td>
    </tr>
  `
}
