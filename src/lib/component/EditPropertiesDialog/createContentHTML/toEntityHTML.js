import anemone from '../../anemone'

export default function (value, label) {
  return () => anemone`
    <tr>
      <td rowspan="2"></td>
      <td>
        <span class="textae-editor__edit-type-values-dialog__type-predicate">type</span>
      </td>
      <td class="ui-front">
        <input class="textae-editor__edit-type-values-dialog__type-name textae-editor__promise-dialog__observable-element" value="${value}">
      </td>
    </tr>
    <tr>
      <td></td>
      <td>
        <span class="textae-editor__edit-type-values-dialog__type-label">${label}</span>
      </td>
    </tr>
  `
}
